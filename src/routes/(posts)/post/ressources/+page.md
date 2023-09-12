---
title: 'Ressources and getting started with ethical hacking'
date: 2023-08-28
length: 15 min
author: ITUnderground
---

## Ressources to learn hacking

### Cryptography

The art of sending secret messages.

It's basically math. If you are good at math, you will probably be good at cryptography. [ComputerPhile](https://www.youtube.com/@Computerphile) has interesting videos on the subject. But here hands on is super important. See the PicoCTF for challenges.

### Forensics

Looking through data dumps and being able to locate important data among massive amounts of garbage.

### Web Hacking

Web hacking is probably one of the easier categories to get into. You can start off with less tools, and you can get started with just a browser.

[Burpsuite](https://portswigger.net/burp) is a great tool for web hacking, and it's free to use. It's a proxy that allows you to intercept and modify requests. If you don't know what that means,
[NetworkChuck has a great playlist](https://www.youtube.com/watch?v=S7MNX_UD7vY&list=PLIhvC56v63IJVXv0GJcl9vO5Z6znCVb1P&pp=iAQB) on networking and how the web works.

### Binary Exploitation - Cybersecurity subject

[LiveOverflow](https://www.youtube.com/watch?v=iyAyN3GFM7A&list=PLhixgUqwRTjxglIswKp9mpkfPNfHkzyeN&pp=iAQB) is a YouTuber that specializes in ethical hacking, and he has a lot of great videos on his channel. This playlist is a great place to start if you want to learn binary exploitation.

Note that this is probably one of the harder categories to get into.

### Hack The Box - Practice tool

Getting hands on is super important. [HackTheBox](https://app.hackthebox.com/home) is a great way to try hacking into _realistic_ systems.

If you can solve medium to hard HackTheBox machines you can probably hack real things too.

You can sign up for free, and there are a lot of great resources online to get started. [Ippsec](https://www.youtube.com/channel/UCa6eh7gCkpPo5XXUDfygQQA) is a YouTuber that specializes in HackTheBox, and he has a lot of great videos on his channel.

### [TryHackMe](https://tryhackme.com/)

Kind of like HackTheBox, but more reading. It's a great place to start if you are new to hacking.

### PicoCTF - Hands on with CTF challenges

[https://picoctf.org/](https://picoctf.org/) is a great place to start if you are new to CTFs. It's a giant collection of CTF challenges, and it's free to sign up. - hint that sorting by most solves is a good way to start.

## Mentality

Here at ITUnderground we try to be as helpful as we possibly can, but the best way to learn cybersecurity or programming for that sake, is not hand-holding. Trying things yourself, Googling, reading documentation and ChatGPT when everything else fails is the best way to learn. We will try to provide you with the tools to get started, and we will help you, but you have to put in the work yourself.

These skills should not be driving by feeling you _need_ to learn it, but rather that you want to.

Be curious!

## Operating systems

We do not want to decide what operating system you use for your own machine. But when we are doing ethical hacking, pentesting, ctf and so on. We do recommend using either a [virtual machine](https://en.wikipedia.org/wiki/Virtual_machine), [wsl](https://www.kali.org/docs/wsl/wsl-preparations/#wsl-in-microsoft-store) or just running a [linux distro](https://en.wikipedia.org/wiki/Virtual_machine) on your machine.

### Virtual machine

For windows we recommend either VMware or virtualbox. Personally I like VMare more.
On MacOS we recommend just [installing Kali Linux in a VM using UTM](https://docs.getutm.app/guides/kali/#troubleshooting).

### WSL

For windows WSL is easily the most convenient way to get started. You can follow the [official guide](https://www.kali.org/docs/wsl/wsl-preparations/#wsl-in-microsoft-store) to get started.

### Linux distro

r33l br0s use arch btw.
Just kidding, but understanding linux is a very sought after skill in the IT industry. The easiest way to learn linux is to use it. So if you are up for it, you can install a linux distro on your machine. **Dont install kali as your main distro** - just use a vm. If you are just getting started, linux mint or ubuntu is probably for you. If you want to go hardcore and build your operating system from scratch, you can try arch linux.

Dual booting is also an option, there are plenty of guides online.

## What is a CTF?

A CTF is a jeopardy style hacking competition. Jeopardy style means that there are a number of challenges in different categories, each with a number of points. The more difficult the challenge, the more points you get for solving it.
