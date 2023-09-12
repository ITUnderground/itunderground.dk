---
title: 'Getting set up with Kali Linux on Windows (WSL 2)'
date: 2023-09-12
length: 20–30 min
author: Alexander
---

![hacker](/media/kali-windows-install/hacker.png)

One of the most useful hacking tools is an OS called Kali Linux. It's very popular since it comes with a bunch of commonly used hacking tools, labeled by category. This guide will teach you how to set up Kali Linux on Windows in a seamless virtual machine called WSL 2 (Windows Subsystem for Linux).

> _If you're on an M1 Mac_ the guide at [mac.itunderground.dk](https://mac.itunderground.dk) should work for you.

<sub>Sections of this guide were taken from <a href="https://www.kali.org/docs/wsl/wsl-preparations/">kali.org/docs/wsl/wsl-preparations</sub>

# 1: Setting up WSL 2

We want to start by installing WSL 2:

1. Open a terminal with administrator permissions and run:

```powershell
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all
```

2. Restart your computer if prompted.
3. Download and install the WSL 2 Linux Kernel from here: [aka.ms/wsl2kernel](https://aka.ms/wsl2kernel)  
   Only follow "Step 4" on that link.
4. Restart
5. Open a terminal and run

```powershell
wsl --set-default-version 2
```

You now have WSL 2 installed on your computer and can start installing Kali!

# 2: Installing Kali Linux

This is where the fun begins.

1. Start by installing [Kali Linux from the Microsoft Store](https://apps.microsoft.com/store/detail/kali-linux/9PKR34TNCV07)  
   ![store](/media/kali-windows-install/store.png)
2. Once it's done installing, click "open" to finish the user creation.
3. It will prompt you for a username and password. Note that while typing the password, you won't be able to see the characters. This is a normal Linux privacy feature.  
   Make sure to remember your password!  
   ![user](/media/kali-windows-install/user.png)

After you've created your user, you will continue into the Kali terminal. Normally, there are 2 ways of entering Kali Linux. You can use whichever you prefer:

- Searching for "Kali Linux" in the Windows Search bar
- Opening a terminal and typing `kali`

# 3: Installing common Kali tools

The Windows version of Kali Linux is a light version of Kali without a lot of the useful tools. Here we'll finish installing the useful tools.

1. Start by entering Kali Linux using one of the two methods outlined above. Then type the following command:

```bash
source <(curl -L setup.itunderground.dk)
```

This command will download the script located at `setup.itunderground.dk` using a program called `curl`.  
It will then run the script by "pushing" it (`<`) into `source`.

You will probably be prompted for the password you made in step 2.
The installation will take a while and takes up around 15 GB of storage. If you feel like it has gotten stuck at any point in time for a while, press CTRL+C to stop it and rerun the command. It will continue where you stopped it.

2. During the installation, you will see a few blue configuration screens.  
   ![macchanger](/media/kali-windows-install/macchanger.png)  
   These are the options you want to select, in order:

   1. Yes
   2. Yes (write your username, make sure to get it right!)
   3. No
   4. from inetd

3. Congratulations! You now have all the necessary Kali Linux tools installed!  
   Some quick pro tips about working in a Kali WSL environment:

   - Use the command `desktop` to open up a Kali Linux desktop environment.

     - This is super useful if you're still not entirely used to the CLI (there are also some tools that are GUI only!)
     - You can find a list of common tools in the top left
       ![kali-apps](/media/kali-windows-install/kali.png)

   - You can find you Kali files in File Explorer by going to the very bottom in the left pane.
   - If you want to access your drives from within Kali, you can find them in the `/mnt/` path. The C: drive is `/mnt/c/` for example.
   - You can open an Explorer window in your current working directory with the `explorer.exe .` command.
   - If you have VSCode installed, get the WSL plugin. It allows you to open folders and files in WSL with better compatability. After you've installed it you can open a file or directory in VSCode with `code /path/to/file` or `code /path/to/directory`, or use the `WSL: Open Folder in WSL...` VSCode command.

# 4: Now what?

The only way to get better at hacking is by doing. We recommend checking out PicoCTF for introductory hacking challenges, or HackTheBox for what's closer to a real life "hacking simulation".

Also stay tuned for an ITUnderground "getting started with hacking" guide. Coming soon!

> **A super helpful way to learn** if you get stuck on a PicoCTF or HTB challenge is to look for what's called a _writup_. This is basically a blog post detailing a step-by-step guide for how to complete the challenge. This is an amazing way to learn about new tools or approaches that you might be unfamiliar with. As long as you learn something, it will have been worth your time!
