---
title: 'FECTF 2023 Qualifiers Padding Oracle'
shortTitle: 'Padding Oracle'
date: 2023-11-4
length: 10 min
author: David
headline: Read a solution to Padding Oracle in FE CTF 2023
---

> **Padding Oracle**  
> baby's 1st - crypto - remote
>
> According to Wikipedia:
>
> > An oracle is a person or thing considered to provide insight, wise counsel or prophetic predictions, most notably including precognition of the future, inspired by deities. If done through occultic means, it is a form of divination.
>
> But please refrain from "occultic means" on our server, ok?
>
> ```
> nc padding-oracle.hack.fe-ctf.dk 1337
> ```
>
> [link to code]

---

<details>
<summary>Table of contents</summary>

- [Challenge file](#challenge-file)
- [AES OFB](#aes-ofb)
  - [Padding in a block cipher](#padding-in-a-block-cipher)
- [Padding oracle attack](#padding-oracle-attack)
  - [The Details](#the-details)
- [Creating a python script](#creating-a-python-script)
- [Two solutions](#two-solutions)
  - [Fix the padding](#fix-the-padding)
  - [Decrypt the whole flag](#decrypt-the-whole-flag)

</details>

## Challenge File

The challenge gives us a single file called: "server.py"

<details>
<summary>server.py</summary>

```python
#!/usr/bin/env -S python3 -u
import os
import threading
import sys
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
from Crypto.Util.Padding import pad, unpad
from binascii import hexlify

os.chdir(os.path.dirname(__file__))
KEY = open("server.key", "rb").read()
FLAG_TXT = open("flag.txt").read()
FLAG_ENC = open("flag.enc").read()

class PaddingError(Exception):
    pass

class CipherTextFormatError(Exception):
    pass

class Cipher:
    def __init__(self, key: bytes):
        self._key = key

    def encrypt(self, message: str) -> str:
        aes = AES.new(self._key, AES.MODE_OFB, iv=get_random_bytes(AES.block_size))
        ciphertext = aes.encrypt(pad(message.encode(), AES.block_size))

        return hexlify(aes.iv + ciphertext).decode()

    def decrypt(self, message: str) -> str:
        ciphertext_bytes = self._get_hex_bytes(message)
        iv, ciphertext = ciphertext_bytes[0:AES.block_size], ciphertext_bytes[AES.block_size:]
        aes = AES.new(self._key, AES.MODE_OFB, iv=iv)
        plaintext = aes.decrypt(ciphertext)
        plaintext_unpad = self._unpad(plaintext)

        return plaintext_unpad.decode()

    @staticmethod
    def _get_hex_bytes(ciphertext: str) -> bytes:
        try:
            if len(ciphertext) % AES.block_size != 0:
                raise CipherTextFormatError()
            return bytes.fromhex(ciphertext)
        except ValueError:
            raise CipherTextFormatError()

    @staticmethod
    def _unpad(plaintext: bytes) -> bytes:
        try:
            return unpad(plaintext, AES.block_size)
        except ValueError:
            raise PaddingError()

cipher = Cipher(KEY)

def handle() -> None:
    print(f"Welcome {os.getenv('SOCAT_PEERADDR', '')}")
    print(f"Encrypted flag: {FLAG_ENC}")
    while True:
        ciphertext = input("Enter a ciphertext you want to decrypt: ").rstrip()
        if not ciphertext:
            break

        try:
            flag_dec = cipher.decrypt(ciphertext)
            if flag_dec == FLAG_TXT:
                print(f"Flag: {flag_dec}")
            else:
                print("Padding correct!")

        except PaddingError:
            print("Padding incorrect!")
        except (CipherTextFormatError, UnicodeDecodeError):
            print("Invalid message format!")

def main() -> None:
    assert len(KEY) in AES.key_size
    assert len(FLAG_ENC) % AES.block_size == 0
    handle()

if __name__ == "__main__":
    main()

```

</details>

We can see that first it loads some constants like, server.key, flag.txt and flag.enc.
After this it defines the cipher class which can encrypt and decrypt a message, with AES "OFB" Mode which is a block cipher we will dive into in just a moment.
After this we can see the handle method, which gives us the encrypted flag, and will continuously let the user input cipher text which it will decrypt and check against the flag from flag.txt.
Lastly the main function asserts that the key is the size that AES expects, and that the encrypted flag is divisible by the aes block size, which is 16, and we will describe very soon.

First thing to try is of course to connect to the server with netcat and try to input the encrypted flag we are given:

```bash
└─$ nc padding-oracle.hack.fe-ctf.dk 1337
Welcome 176.22.129.167
Encrypted flag: 86a20692ae8c371513a888a72b0628210252f70d940628392eb37db391722bcb5d
Enter a ciphertext you want to decrypt: 86a20692ae8c371513a888a72b0628210252f70d94
Padding incorrect!
Enter a ciphertext you want to decrypt:
```

And of course it does not work. That would be too easy. They must have changed the encrypted flag such that the padding is incorrect.

## AES OFB

Firstly we need to understand the encryption we are dealing with. Taking a look on wikipedia we can see a diagram of how the [AES OFB](<https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#Output_feedback_(OFB)>) encryption and decryption works.
![AES_OFB_ENCRYPTION](/media/writeups/fectf23/padding-oracle/OFB_encryption.png)
We can see that this is a block cipher, meaning the plaintext will we split into blocks which will be used as input separately.
The encryption starts with what's called an initialization vector or IV, which is just some random bytes that makes sure that even if you encrypt the same string, you will get a different ciphertext.
The IV is input into the block Cipher encryption, which does some complex math with the server key that we don't care about for this writeup.
The output of this goes to two places. Traveling directly down it is then used in a XOR operation with the plain text to create the first block of ciphertext.
Besides this the output of the encrypted IV is also used as the input to the next block, and the output of that is used for the next block, and this chain continues for all the blocks. This ensures that a single change in the input IV will change all of the ciphertext.

![AES_OFB_ENCRYPTION](/media/writeups/fectf23/padding-oracle/OFB_encryption.png)
The decryption is exactly the same, just input the ciphertext where the plaintext was before and out comes the plaintext.

### Padding in a block cipher

When splitting the plaintext into blocks of 16 it will often occur that the input is not evenly divisible by the block size, and the last block will be missing some characters.
To fix this the server will pad the input before encryption. A widely used padding type is called "pkcs7 padding". It works by using the amount of padding added as padding. So if there is just 1 byte of padding the padding would be "01".
If we need 4 bytes of padding to reach the block size we pad with "04040404".

## Padding oracle attack

The challenge clearly hints at the server being vulnerable to an attack called a padding oracle attack. This is an attack that can fully decrypt a ciphertext, if the server leaks when the padding is correct, and when it's not correct.
This could happen in the real world if a server fails to unpad the output, and does not catch the exception. In our case the server will also clearly state whether the padding is correct or not, so we can try to use a padding oracle attack.

### The Details

The idea of the padding oracle attack stems from the fact that the server will tell us when the last byte of the plaintext is 0x01, since the padding at that point will be valid.
Since the ciphertext is just XORd with the output of the block decryption, changing the last byte of the ciphertext by 1 will also change the last byte of the plaintext by 1.
This way we can just bruteforce all 256 values of the last byte until the server responded that the padding is valid.
When this happens we now have the ciphertext which corresponds to the plaintext 0x01, when XORd with the output of the block encryption, which we from now on will call the intermediate value.
By the properties of XOR we can get the intermediate value I<sub>16</sub> (The last intermediate value of the block)
by XORing the known plaintext 0x01 with the known ciphertext: <code>I<sub>16</sub> = E<sub>16</sub> ^ P<sub>16</sub></code>
With the intermediate value, we can now get the PLAINTEXT!. Yes, since we know the encrypted ciphertext for the flag, and the intermediate value, we can follow the regular decryption diagram and get the plaintext: <code>P<sub>16</sub> = E<sub>16</sub> ^ I<sub>16</sub></code>

The next magic step is to realize that with the intermediate value <code>I<sub>16</sub></code> we can set the plaintext value <code>P<sub>16</sub></code> to whatever we want, and get the ciphertext that will decrypt to our value: <code>E'<sub>16</sub> = I<sub>16</sub> ^ P<sub>16</sub></code>.
And if we set the last byte to 0x02, the previous byte <code>P<sub>15</sub></code> will only be valid padding if its value also is 0x02. So we can just brute force the same as before, and then set all the plaintext bytes to 0x03, then 0x04 and so on.
This way we can get the plaintext of the whole block.

Lucky for us the rest of the block are the exact same. Looking back at the decryption diagram, the last block of ciphertext is only used in one place, and nothing, apart from the plaintext of course, depends on it. So we can just remove it, and the decryption will function all the same.
So you can actually decrypt whatever block you want, just remove all the following blocks ciphertext, and start decrypting the block.

_Take a look at [this article](https://robertheaton.com/2013/07/29/padding-oracle-attack/) for another great explanation_

## Creating a python script

To exploit the padding oracle vulnerability, we will first need to generate the payloads to send to the server. Reading through the server code we can see that the IV is added to the fron of the ciphertext, since we don't need to decrypt this, we can pass this + any previous block we aren't decrypting yet as a prefix.

```python
for x in range(256):
    payload = hex(x)[2:].zfill(2) # Current byte formatet in hex
    payload += "".join([hex(x)[2:].zfill(2) for x in encyptedPaddingBytes]) # Currently set padding bytes
    payload = payload.zfill(32) # Fill to fit block size
    payload = prefix + payload # Add any preceding blocks
```

This loop will go through all possible values for a single byte, and set up the correct string to send to the server, in the variable payload.

```python
def attack_block(prefix: str):
    intermediaryValues = []
    for i in range(16):
        encyptedPaddingBytes = xor_list_with_val(intermediaryValues, i+1)
        for x in range(256):
            payload = hex(x)[2:].zfill(2) # Current byte formatet in hex
            payload += "".join([hex(x)[2:].zfill(2) for x in encyptedPaddingBytes]) # Currently set padding bytes
            payload = payload.zfill(32) # Fill to fit block size
            payload = prefix + payload # Add any preceding blocks

            print(payload)
            if (test_payload(payload)):
                intermediaryVal = x^(i+1)
                intermediaryValues.insert(0, intermediaryVal)
                break
    return intermediaryValues
```

This payload is passed to a test_payload function, which will return true if the padding is correct. If it is, we get the intermediate value by XORing the found cipher text, `x`, with the index of the byte in the block (from the end), `i`.
This is wrapped in a loop that does this for every byte of the block. When an intermediate value is found it is added to an array, and the encyptedPaddingBytes will be updated with the correct padding bytes to bruteforce the byte at the current index.
We return the intermediate values, which we can always XOR with our cipher text to get the plaintext.

```python
import pwn

conn = pwn.remote("padding-oracle.hack.fe-ctf.dk", "1337")
conn.recvuntil("Enter a ciphertext you want to decrypt: ")

def test_payload(payload):
    conn.sendline(payload)
    resp = conn.recvuntil("Enter a ciphertext you want to decrypt: ").decode()

    if "Padding correct!" in resp or "Invalid message format" in resp:
        return True
    else:
        return False
```

To test the payloads we simply use pwntools to connect to the server and check if we get a valid response. Since the server also gives a Invalid message format error if it can't decode the message, we just return true for that as well.

## Two solutions

From this point on we have two solutions: We can continue to decrypt the other blocks and read the flag, or we can fix the padding bytes of the encrypted flag, give that to the server and read the flag from there.

### Fix the padding

First we need to figure out how much padding there is in the last block. From there we can use the intermediate values, XOR them with the amount of padding we want, and get the correct encrypted bytes:

```python
encyptedFlag = "86a20692ae8c371513a888a72b0628210252f70d940628392eb37db391722bcb5da0a6ac6943b0a5c3dcff7890f3c1cf876fc8eb227a254c4d36290624ed47b9"

# There are 4 blocks and we skip the first 3, which are each 16 bytes. 16 * 3 = 48.
prefix = encyptedFlag[:48]

intermediary = attack_block(prefix)
#intermediary = [227, 94, 166, 140, 95, 172, 108, 202, 218, 85, 201, 238, 241, 162, 27, 87]

flagBytes = bytes.fromhex(encyptedFlag)
plaintext = bytes(xor_lists(flagBytes[48:],intermediary)) # encrypted XOR intermediary results in the plaintext
print("Plaintext of last block is: ", plaintext)

flagLengthInLastBlock = 5 # Get this by running the code above, and seeing how much of the block is the flag.
paddingLength = 16 - flagLengthInLastBlock # The rest of the block should be padding

# Get the last blocks encrypted padding
padding = bytes(xor_list_with_val(intermediary[flagLengthInLastBlock:], paddingLength)).hex()

print(flagBytes[:48+flagLengthInLastBlock].hex() + padding)
```

Passing the output to the server we get the flag `flag{y0u_gu3ss3d_th3_c0rr3ct_p4dd1ng}`.

### Decrypt the whole flag

We can just as easialy decrypt the whole flag, althrough it does take a few minutes. We just skip over the IV block, and then begin bruteforcing blocks one by one. We just need to add the previous bytes to the prefix, when starting the next one.

```python
encyptedFlag = "86a20692ae8c371513a888a72b0628210252f70d940628392eb37db391722bcb5da0a6ac6943b0a5c3dcff7890f3c1cf876fc8eb227a254c4d36290624ed47b9"

blockSize = 16*2
blocks = [encyptedFlag[i:i + blockSize] for i in range(0, len(encyptedFlag), blockSize)]
prefix = blocks.pop(0) # Pop IV from encFlag

allIntermidiaries = []

while len(blocks) > 0:
    allIntermidiaries += attack_block(prefix)
    prefix += blocks.pop(0)

flagBytes = bytes.fromhex(encyptedFlag)
print(bytes(xor_lists(flagBytes[16:],allIntermidiaries)))


```

And again we get the flag: `b'flag{y0u_gu3ss3d_th3_c0rr3ct_p4dd1ng}\xd6I\x86\x97c\xe0\xe8\xd5O\\\xee' `

## Solve Scripts

<details>
<summary>Click to reveal solvescript "Get padding"</summary>

```python
import pwn

conn = pwn.remote("padding-oracle.hack.fe-ctf.dk", "1337")
conn.recvuntil("Enter a ciphertext you want to decrypt: ")

def test_payload(payload):
    conn.sendline(payload)
    resp = conn.recvuntil("Enter a ciphertext you want to decrypt: ").decode()

    if "Padding correct!" in resp or "Invalid message format" in resp:
        return True
    else:
        return False

def xor_list_with_val(intermidiaries, val):
    return [x^val for x in intermidiaries]

def xor_lists(l1, l2):
    return list(map(lambda x,y: x^y, l1, l2))

def attack_block(prefix: str):
    intermediaryValues = []
    for i in range(16):
        encyptedPaddingBytes = xor_list_with_val(intermediaryValues, i+1)
        for x in range(256):
            payload = hex(x)[2:].zfill(2) # Current byte formatet in hex
            payload += "".join([hex(x)[2:].zfill(2) for x in encyptedPaddingBytes]) # Currently set padding bytes
            payload = payload.zfill(32) # Fill to fit block size
            payload = prefix + payload # Add any preceding blocks

            print(payload)
            if (test_payload(payload)):
                intermediaryVal = x^(i+1)
                intermediaryValues.insert(0, intermediaryVal)
                break
    return intermediaryValues

encyptedFlag = "86a20692ae8c371513a888a72b0628210252f70d940628392eb37db391722bcb5da0a6ac6943b0a5c3dcff7890f3c1cf876fc8eb227a254c4d36290624ed47b9"

# There are 4 blocks and we skip the first 3, which are each 16 bytes aka 32 charectors. 32 * 3 = 96 charectors 48 bytes.
prefix = encyptedFlag[:96]

intermediary = attack_block(prefix)
#intermediary = [227, 94, 166, 140, 95, 172, 108, 202, 218, 85, 201, 238, 241, 162, 27, 87]
print(intermediary)

flagBytes = bytes.fromhex(encyptedFlag)
plaintext = bytes(xor_lists(flagBytes[48:],intermediary)) # encrypted XOR intermediary results in the plaintext
print("Plaintext of last block is: ", plaintext)

flagLengthInLastBlock = 5 # Get this by running the code above, and seeing how much of the block is the flag.
paddingLength = 16 - flagLengthInLastBlock # The rest of the block should be padding

# Get the last blocks encrypted padding
padding = bytes(xor_list_with_val(intermediary[flagLengthInLastBlock:], paddingLength)).hex()

print(flagBytes[:48+flagLengthInLastBlock].hex() + padding)

# 86a20692ae8c371513a888a72b0628210252f70d940628392eb37db391722bcb5da0a6ac6943b0a5c3dcff7890f3c1cf876fc8eb22a767c1d15ec2e5faa9105c
# flag{y0u_gu3ss3d_th3_c0rr3ct_p4dd1ng}
```

</details>

<details>
<summary>Click to reveal solvescript "Decrypt full flag"</summary>

```python
import pwn

conn = pwn.remote("padding-oracle.hack.fe-ctf.dk", "1337")
conn.recvuntil("Enter a ciphertext you want to decrypt: ")

def testPayload(payload):
    conn.sendline(payload)
    resp = conn.recvuntil("Enter a ciphertext you want to decrypt: ").decode()

    if "Padding correct!" in resp or "Invalid message format" in resp:
        return True
    else:
        return False

def xor_list_with_val(intermidiaries, val):
    return [x^val for x in intermidiaries]

def xor_lists(l1, l2):
    return list(map(lambda x,y: x^y, l1, l2))

def attack_block(prefix):
    intermediaryValues = []
    for i in range(16):
        encyptedPaddingBytes = xor_list_with_val(intermediaryValues, i+1)
        for x in range(256):
            payload = hex(x)[2:].zfill(2)
            payload += "".join([hex(x)[2:].zfill(2) for x in encyptedPaddingBytes])
            payload = payload.zfill(32)
            payload = prefix + payload
            print(payload)
            if (testPayload(payload)):
                intermediaryVal = x^(i+1)
                intermediaryValues.insert(0, intermediaryVal)
                break
    return intermediaryValues

encyptedFlag = "86a20692ae8c371513a888a72b0628210252f70d940628392eb37db391722bcb5da0a6ac6943b0a5c3dcff7890f3c1cf876fc8eb227a254c4d36290624ed47b9"

blockSize = 16*2
blocks = [encyptedFlag[i:i + blockSize] for i in range(0, len(encyptedFlag), blockSize)]
prefix = blocks.pop(0) # Pop IV from encFlag

allIntermidiaries = []

while len(blocks) > 0:
    allIntermidiaries += attack_block(prefix)
    prefix += blocks.pop(0)

flagBytes = bytes.fromhex(encyptedFlag)
print(bytes(xor_lists(flagBytes[16:],allIntermidiaries)))

# b'flag{y0u_gu3ss3d_th3_c0rr3ct_p4dd1ng}\xd6I\x86\x97c\xe0\xe8\xd5O\\\xee'

```

</details>
