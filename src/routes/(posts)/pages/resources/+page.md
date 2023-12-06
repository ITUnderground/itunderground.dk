---
title: 'Resources and getting started with ethical hacking'
date: 2023-09-11
length: 15 min
author: ITUnderground
---

<details>
<summary>Table of contents</summary>

- [Resources to learn hacking](#resources-to-learn-hacking)
  - [Categories](#categories)
    - [Cryptography](#cryptography)
    - [Forensics](#forensics)
    - [Web Hacking](#web-hacking)
    - [Binary Exploitation](#binary-exploitation---cybersecurity-subject)
  - [Where do I learn?](#where-do-i-learn)
    - [HackTheBox](#hack-the-box)
    - [TryHackMe](#tryhackme)
    - [PicoCTF](#picoctf---hands-on-with-ctf-challenges)
- [Mentality](#mentality)
  - [Operating systems](#operating-systems)
    - [Virtual machine](#virtual-machine)
    - [WSL](#wsl)
    - [Linux and Kali](#linux-and-why-we-use-kali)
  - [What's a CTF?](#whats-a-ctf)

</details>

## Resources to learn hacking

### Categories

#### Cryptography

_The art of sending secret messages_.

It's basically math. If you are good at math, you will probably be good at cryptography. [ComputerPhile](https://www.youtube.com/@Computerphile) has interesting videos on the subject. But here hands on is super important. See the [PicoCTF](https://play.picoctf.org/) for challenges.

#### Forensics

Looking through data dumps and being able to locate important data among massive amounts of garbage.  
This could be something like digging through a hard drive backup or recovering data from deleted files.

_No forensics resources right now, but stay tuned._

#### Web Hacking

Web hacking is probably one of the easier categories to get into. The only tool you need to get started is your browser.

[Burpsuite](https://portswigger.net/burp) is a great tool for web hacking, and it's free to use. It's a proxy that allows you to intercept and modify requests. If you don't know what that means,
[NetworkChuck has a great playlist](https://www.youtube.com/watch?v=S7MNX_UD7vY&list=PLIhvC56v63IJVXv0GJcl9vO5Z6znCVb1P&pp=iAQB) on networking and how the web works.

#### Binary Exploitation - Cybersecurity subject

[LiveOverflow](https://www.youtube.com/@LiveOverflow) is a YouTuber that specializes in ethical hacking, and he has a lot of great videos on his channel. [This playlist](https://www.youtube.com/watch?v=iyAyN3GFM7A&list=PLhixgUqwRTjxglIswKp9mpkfPNfHkzyeN&pp=iAQB) is a great place to start if you want to learn binary exploitation.

Note that this is probably one of the harder categories to get into.  
Common tools include Ghidra and gdb.

### Where do I learn?

#### [Hack The Box](https://app.hackthebox.com/)

Getting hands on is super important. [HackTheBox](https://app.hackthebox.com/home) is a great way to try hacking into _realistic_ systems. Start [here](https://app.hackthebox.com/starting-point) once you've made an account.

If you can solve medium to hard HackTheBox machines you can probably hack real things too.

You can sign up for free, and there are a lot of great resources online to get started. [Ippsec](https://www.youtube.com/channel/UCa6eh7gCkpPo5XXUDfygQQA) is a YouTuber that specializes in HackTheBox, and he has a lot of great videos on his channel.

#### [TryHackMe](https://tryhackme.com/)

Kind of like HackTheBox, but more reading. It's a great place to start if you are new to hacking.

#### [PicoCTF](https://picoctf.org/#picogym) - Hands on with CTF challenges

PicoCTF is a great place to start if you are new to CTFs. It's a giant collection of CTF challenges, and it's free to sign up. - hint that sorting by most solves is a good way to start.

## Mentality

Here at ITUnderground we try to be as helpful as we possibly can, but the best way to learn cybersecurity (or just programming for that sake), is not hand-holding. Trying things yourself, Googling, reading documentation and ChatGPT when everything else fails is the best way to learn. We will try to provide you with the tools to get started, and we will help you, but you have to put in the work yourself.

You should not feel the _need_ to learn these things, but the _want_ to.

**Be curious!**

### Operating systems

We do not want to decide what operating system you use for your own machine. But when we are doing ethical hacking, pentesting, ctf and so on. We do recommend using either a [virtual machine](https://en.wikipedia.org/wiki/Virtual_machine), [wsl](/blog/setting-up-kali-windows) or just running a linux distro on your machine.  
We will usually recommend having an installation of [Kali Linux](https://www.kali.org/), whether that be in a VM, dual-boot or in WSL.

#### Virtual machine

For Windows we recommend either [VMware](https://www.vmware.com/nordics.html) or [VirtualBox](https://www.virtualbox.org/). Personally I like VMware more.
On MacOS we recommend [UTM](https://mac.getutm.app/).

Kali can be installed in [VMware](https://www.kali.org/docs/virtualization/install-vmware-guest-vm/), [VirtualBox](https://www.kali.org/docs/virtualization/install-virtualbox-guest-vm/) and [UTM](https://docs.getutm.app/guides/kali/).

#### WSL

For Windows, WSL the most convenient way to get started. You can follow our [Kali Linux WSL setup guide](/blog/setting-up-kali-windows) to get started.

#### Linux and why we use Kali

r33l br0s use arch btw.
Just kidding, but understanding linux is a very sought after skill in the IT industry. The easiest way to learn Linux is to use it. So if you are up for it, you can install a Linux distro on your main machine, but it's not a steadfast requirement for learning to hack.

> <b style="color:var(--error) !important">Dont install Kali as your main distro</b> - just use a vm (see the two sections above).
>
> Kali is designed exclusively for hacking, not for daily use.

**If you want to run Linux** and are just getting started, Linux Mint or Ubuntu is probably for you. If you want to go hardcore and build your operating system from scratch, you can try Arch Linux.

**If you're fine with current OS** and just want to use Linux for hacking, refer to the above sections.

Dual booting is also an option, there are plenty of guides online.

### What's a CTF?

A CTF (Capture The Flag) is a jeopardy style hacking competition. Jeopardy style means that there are a number of challenges in different categories, each with a number of points. The more difficult the challenge, the more points you get for solving it.

The goal of each challenge is to capture the flag. "Flag" usually means a short string in the format `"name{flag}"` where `name` is the name of the competition, and `flag` is some text related to the challenge solution.
In a challenge where you have to hack into a server for example, the flag might be located in `/home/user/flag.txt`, and in a crypography challenge you would get the flag upon decoding some string.

> Tip: Since almost all flags are in the format `name{flag}`, a common tactic is to look for substrings like `name{`.
