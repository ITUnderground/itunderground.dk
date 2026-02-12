---
title: 'Making challenges for our CTF'
date: 2026-02-12
length: 20 min
author: David
---

## Server setup

We use a single server for everyone, which runs the website and the challenges for the event.
Docker is used for everything, each challenge will one or more docker containers, which can be accessed either by directly opening a port, or by using the shared "reverseProxy" docker network, and pointing a subdomain at the challenge like web1.chall.itunderground.dk.
The score website is CTFD where people signup and submit flags.

Because we don't spawn instances for every team, each challenge has to be able to handle multiple people, this means no creating non user specific files, and only readonly ssh. There are clever ways around these limitations, like jails and creating new home folders for each connection like in `grades` from last event.

For the last event we spun up a separate server on azure separate from our primary ctf.itunderground.dk website, but the challenge setup is the exact same.

## Challenge setup

To make a challenge, start by being able to solve it yourself, this means wether it's a python file or js project, test that you can get the flag, and ideally write a writeup on how to solve it. Our flag format is itu{xxx}.
Every challenge has a singe folder in this repo with the name of the challenge.

If you have an idea for a challenge feel free to ask about how to make/deploy it.

### Only static file

If the challenge just uses static files, meaning you don't have to start any service or connect to anything, these can just be uploaded directly to CTFD, and in the folder here on github. Just ask for access to the admin account, and you can create it on CTFD.

### Dynamic challenges

For challenges that do need a connection, they have to be put inside a docker container. Please make a single compose.yml file which specifies the containers needed for the challenge. This file is started with `docker compose up`. You can look at the previous challenges for inspiration. For some challenges you can simply mount your challenge files inside with a bind mount, and run the container. See rigged-wheel/compose.yml from the previous WHFD event.
For many challenges you will need a Dockerfile as well, which the compose can build, where you can specify exactly where to put files in the docker container and what command to run. See fram3scape/Dockerfile.
Connections with netcat can also be opened for many people using socat, to spawn a new process for each connection. See spy-kids/Dockerfile from the itu-ctf repo.
