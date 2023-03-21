# ITUnderground.dk website  
This repository contains the files for the [itunderground.dk](https://itunderground.dk) website. The `main` branch has the source, while the `gh-pages` branch is the live static page.  
The website itself is a simulation of a Linux shell in the browser, made using SvelteKit. It also supposed blog-like contents in the form of markdown files, located in `src/routes/post/`.  
  
## Extending  
There are two user-friendly ways to extend the website. **Markdown** files and **commands**.  
To extend, you first need to set up a local development environment.  
  
# Setting up a local environment  
## Dependencies  
* Git: https://git-scm.com/downloads
* Node.js: https://nodejs.org/ (Most newer versions should work. If you experience problems, use v19).  
  
## Setup  
Clone this repository to your machine:  
```bash
git clone https://github.com/ITUnderground/website
```
Once it's been cloned, enter it and install the npm packages.
```bash
cd website
npm install
```
  
## Running and building  
To run the website locally use following command:  
```bash
npm run dev
```
It will host the website on `localhost:5173`.  
Once you're confident with your changes, run this command to update the website:  
```bash
npm run build
```
> **❗ Warning**  
> The above command pushes your changes *directly* to the `gh-pages` branch. Running it will *immediately* update the LIVE version on https://itunderground.dk, so make sure all your changes are final.  
  
Once you've made some changes, don't forget to push them!  
```bash
git add .
git commit -m "Write what you changed here"
git push
```
# Extending  
Once you've set up a local environment, you can begin updating the website.  
## Markdown  
Markdown files are used for blog-like posts. An example of this is [itunderground.dk/post/who-are-we](https://itunderground.dk/post/who-are-we). The corresponding markdown file is located in `src/routes/post/who-are-we/+page.md`.  
  
To render markdown, we use [mdsvex](https://mdsvex.com/). It supports both .md files and .svx files, and both support directly inserting Svelte components. That means you can for example create a dynamic that fetches data from some server (remember, the site is static so make sure any data fetching happens client-side!).  
  
~~View [next-events](src/routes/post/next-events/%2Bpage.md) for an example of a data-fetching markdown file. It fetches data from out public calendar.~~ <- Not yet implemented.  
  
Once a markdown file has been added, don't forget to 1. **push your changes** to the main repo and 2. **build** the website to update it (See [Running and building](#running-and-building)).  
  
## Commands  
All commands in the Linux shell are custom implementations written in TypeScript. They're located in `src/lib/shell/commands/`, with some built-in core commands located in `builtin/`.  
To add a command create a new TypeScript file in the `commands/` directory with the name of the command you wan't to implement. Copy the following template:  
```ts
import type { AccessObject } from '../types';

function mycommand({ cli, dir, env, js, command }: AccessObject): string {
    return "Hello world!"
}
mycommand.description = 'My cool and awesome command!';

export default mycommand;
```
  
There are some important things to note here:  
1. The AccessObject contains all the metadata you have access to in the command.  
    * `cli`: Exposes basic CLI methods that allows you to run a command and print to regular output, as well as the log.  
    See `clear` and `sudo` for commands that use this object.  
    * `dir`: Exposes directory related methods, like current working directory and methods to get directories and files.  
    See `cd` and `ls` for commands that use this object.  
    * `env`: Exposes methods related to environment variables, like `get` and `set`.  
    See `builtin/echo` for a command that uses this object.  
    * `js`: Allow you to execute JavaScript in the browser.  
    No commands currently implement this object.  
    * `command`: Information about the command that was run. This object contains the arguments of the command.  
    `positional` arguments are arguments relative to a command. That is, in `cat file.txt`, `file.txt` would be the first positional argument. This is a list of strings.  
    `named` arguments are arguments passed as flags. That is, in `python -m script`, `script` is the named argument of `-m`. This is key-value object, being `{ "-m": "script" }` in the example.  
    `raw` is the raw string command.  
    See `cat` and `sudo` for commands that implement this object.  
2. The command does not have to return anything, but if it does it this should be a string. This is what will be printed as the output of the command.  
Note that any HTML will be rendered, though script tag will not execute.  
3. The command *has* to define a description as shown in the template.  
  
Finally, **to be able to use the command**, add it in `commands/index.ts`. Commands not defined in this file *will not work*.  