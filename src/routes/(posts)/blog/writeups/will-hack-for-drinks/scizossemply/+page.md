---
title: 'WHFD 2025 - scizossembly'
shortTitle: 'scizossembly'
date: 2025-04-11
length: 2 min
author: tw0
headline: Read a solution to scizossembly in Will Hack For Drinks 2025
---

> The voices... I need them silenced. Use these runes to turn their screams into
> meaningless mumbles.
>
> flag format: `itu{$program_output}`

---
### What to do?
rewrite thingy in c
run program get output
paste in flag


### how?
we get:
```assembly
section .data
    str db "intheendiwastheonlyoneleftstandinginthefieldaloneandpowerlessbutasiassembledmylastwordsicarriedintothefiremylastpunchfilledwithsoul", 0
    newline db 10

section .text
    global main
    extern putchar

main:
    push    rbp
    mov     rbp, rsp
    mov     r12d, 3
    
loop_start:
    movzx   edi, BYTE [str + r12]
    test    edi, edi
    je      loop_end
    call    putchar
    add     r12d, 4
    jmp     loop_start
    
loop_end:
    mov     edi, 10
    call    putchar
    xor     eax, eax
    mov     rsp, rbp
    pop     rbp
    ret
```
So lets break it down. 

String Setup
The `str` variable holds a null-terminated string.
```c
char str[] = "intheendiwastheonlyoneleftstandinginthefieldaloneandpowerlessbutasiassembledmylastwordsicarriedintothefiremylastpunchfilledwithsoul";
```

Start Index
`r12d` is set to 3, so the program starts from the 4th character (ix from 0).
```c
int i = 3;
```

Loop
- `movzx edi, BYTE [str + r12]` Load character from str[r12].
- `test edi, edi + je` If character is 0 (null terminator), exit loop.
- `call putchar` Print the character.
- `add r12d, 4` Move 4 characters ahead.
- `jmp` Repeat.
```c
    for (int i = 3; str[i] != '\0'; i += 4) {
        putchar(str[i]);
    }
```

End
After the loop, it prints a newline (10) and returns 0.
```c
    putchar('\n');
    return 0;
```


All together:
```c
int main() {
    char str[] = "intheendiwastheonlyoneleftstandinginthefieldaloneandpowerlessbutasiassembledmylastwordsicarriedintothefiremylastpunchfilledwithsoul";
    
    for (int i = 3; str[i] != '\0'; i += 4) {
        putchar(str[i]);
    }

    putchar('\n');
    return 0;
}
```
