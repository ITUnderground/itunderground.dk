# ITUnderground.dk website

This repository contains the files for the [itunderground.dk](https://itunderground.dk) website. The `main` branch has the source, while the `gh-pages` branch is the live static page.  
The website itself is a simulation of a Linux shell in the browser, made using SvelteKit. It also supposed blog-like contents in the form of markdown files, located in `src/routes/post/`.

## Extending

There are two user-friendly ways to extend the website. **Markdown** files and **commands**.  
To extend, you first need to set up a local development environment.

# Setting up a local environment

## Dependencies

- Git: https://git-scm.com/downloads
- Node.js: https://nodejs.org/ <sub>(Most newer versions should work, project was last built with v20).</sub>
- pnpm: https://pnpm.io/installation <sub>(you can probably use npm if you change `pnpm` to `npm` in `package.json`.)</sub>

## Setup

Clone this repository to your machine:

```bash
git clone https://github.com/ITUnderground/itunderground.dk
```

Once it's been cloned, enter it and install the npm packages.

```bash
cd itunderground.dk
pnpm install
```

## Running and building

To run the website locally use following command:

```bash
pnpm run dev
```

It will host the website on [localhost:5173](http://localhost:5173).

Once you're confident with your changes, push them to GitHub and the Actions Workflow will automatically update the site:

```bash
git add .
git commit -m "Write what you changed here"
git push
```

> **❗ Warning**  
> Pushing to the `master` branch will _immediately_ update the LIVE version on [itunderground.dk](https://itunderground.dk), so make sure all your changes are final before pushing.

# Extending

Once you've set up a local environment, you can begin updating the website.  
There are 3 main elements of itunderground.dk:

- [Markdown/posts](#markdown)
- [CLI/commands](#commands)
- [Visuals/design](#design)

## Markdown

Markdown files are used for blog-like posts. An example of this is [itunderground.dk/post/who-are-we](https://itunderground.dk/post/who-are-we). The corresponding markdown file is located in [`src/routes/post/who-are-we/+page.md`](./src/routes/post/who-are-we/+page.md).

To render markdown, we use [mdsvex](https://mdsvex.com/). It supports both .md files and .svx files, and both support directly inserting Svelte components. That means you can for example create a dynamic that fetches data from some server (remember, the site is static so make sure any data fetching happens client-side!).

~~View [next-events](src/routes/post/next-events/%2Bpage.md) for an example of a data-fetching markdown file. It fetches data from out public calendar.~~ <- Not yet implemented.

To add a markdown file, create a directory corresponding to its name and add a `+page.md` file. Remember to link to the file somewhere, such as in the [dir](src/lib/shell/dir.ts) or there won't be a way to navigate to it.

Push your changes to GitHub to see the updated website.

## Commands

All commands in the Linux shell are custom implementations written in TypeScript. They're located in [`src/lib/shell/commands/`](src/lib/shell/commands/), with some built-in core commands located in [`builtin/`](src/lib/shell/commands/builtin/).  
To add a command create a new TypeScript file in the [`commands/`](src/lib/shell/commands/) directory with the name of the command you want to implement. Copy the following template:

```ts
import type { AccessObject } from '../types';

function mycommand({ cli, dir, env, js, command }: AccessObject): string {
	return 'Hello world!';
}
mycommand.description = 'My cool and awesome command!';

export default mycommand;
```

It is highly recommanded that you use something like IntelliSense to view all properties on the AccesObject that your command has access to. Methods starting with and underscore (\_) should be avoided as they are meant for internal use. See other commands for inspiration on how to make use of this object.

1. The AccessObject contains all the metadata you have access to in the command.
   - `cli`: Exposes basic CLI methods that allows you to run a command and print to regular output, as well as the log.  
     See `clear` and `sudo` for commands that use this object.
   - `dir`: Exposes directory related methods, like current working directory and methods to get directories and files.  
     See `cd` and `ls` for commands that use this object.
   - `env`: Exposes methods related to environment variables, like `get` and `set`.  
     See `builtin/echo` for a command that uses this object.
   - `js`: Allow you to execute JavaScript in the browser.  
     No commands currently implement this object.
   - `command`: Information about the command that was run. This object contains the arguments of the command.  
     `positional` arguments are arguments relative to a command. That is, in `cat file.txt`, `file.txt` would be the first positional argument. This is a list of strings.  
     `named` arguments are arguments passed as flags. That is, in `python -m script`, `script` is the named argument of `-m`. This is key-value object, being `{ "-m": "script" }` in the example.  
     `raw` is the raw string command.  
     See `cat` and `sudo` for commands that implement this object.
2. The command does not have to return anything, but if it does it this should be a string. This is what will be printed as the output of the command.  
   Note that any HTML will be rendered, though script tag will not execute.
3. The command _has_ to define a description as shown in the template.

Finally, **to be able to use the command**, add it in `commands/index.ts`. Commands not defined in this file _will not work_.
