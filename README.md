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
pnpm install # Note: You can also choose to use npm, but pnpm is preferred
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

To render markdown, we use [mdsvex](https://mdsvex.com/). It supports both .md files and .svx files, and both support directly inserting Svelte components. That means you can for example create a dynamic markdown file that fetches data from some server (remember, the site is static so make sure any data fetching happens client-side!).

Dynamic data fetching in markdown components has not yet been used on our site, but feel free to add it to the readme if you decide to utilize it.

To add a markdown file, create a directory corresponding to its name and add a `+page.md` file. Remember to link to the file somewhere, such as in the [default filesystem](src/lib/shell/const.ts) or there won't be a way to navigate to it (This is not necessary for writeups unless starting a new CTF. Their links are automatically updated).

Push your changes to GitHub to see the updated website.

## Commands

All commands in the Linux shell are custom implementations written in TypeScript. They're located in [`src/lib/shell/commands/`](src/lib/shell/commands/), with some built-in core commands located in [`builtin/`](src/lib/shell/commands/builtin/).  
To add a command create a new TypeScript file in the [`commands/`](src/lib/shell/commands/) directory with the name of the command you want to implement. Copy the following template:

```ts
import Command from '../command';

export default new Command({
	command({ cli, dir, env, js, command }) {
		// Logic here
		const flagValue = command.namedArguments['userflag'];

		cli.stdout('Hello world!');
		return `You passed the flag ${flagValue}!`;
	},
	description: 'My cool and awesome command.',
	namedArguments: [
		{
			name: 'userflag',
			choices: ['flag', 'userflag', 'f'],
			hasValue: true
		}
	]
});
```

It is highly recommanded that you use something like IntelliSense to view all properties on the AccesObject that your command has access to. It can also be helpful to look at the type definitions in [`src/lib/shell/types.d.ts`](src/lib/shell/types.d.ts). Methods starting with and underscore (\_) should be avoided as they are meant for internal use. See other commands for inspiration on how to make use of this object.

1. The AccessObject contains all the metadata you have access to in the command.
   - `cli`: Exposes basic CLI methods that allows you to run a command and print to regular output, as well as the log.  
     See `clear` and `sudo` for commands that use this object.
   - `dir`: Exposes directory related methods, like current working directory and methods to get directories and files.  
     See `cd` and `ls` for commands that use this object.
   - `env`: Exposes methods related to environment variables, like `get` and `set`.  
     See `builtin/echo` for a command that uses this object.
   - `js`: Allow you to execute JavaScript in the browser.  
     See `neofetch` for a command that uses this function.
   - `command`: Information about the command that was run. This object contains the arguments of the command.  
      `name` is the name of the command, aka. the first word of the input.
     `positionalArguments` are arguments relative to a command. That is, in `cat file.txt`, `file.txt` would be the first positional argument. This is a list of strings.  
      `namedArguments` are arguments passed as flags. That is, in `python -m script`, `script` is the value of the named argument `-m`. To receive `namedArguments`, they must be defined in the `namedArguments` section. In the example above, the argument named "userflag" can be passed to the command using either `--flag`, `--userflag` or `-f`. Internally, its name is "userflag", and it expects a value. If `hasValue` is nullable, the value of the argument will simply be `true` if it is present. The value of any argument not passed by the user is `false`.  
     **Note**: If an argument with `hasValue: true` is passed to the command _without_ a value, it will have value `undefined`. If the argument is _not_ passed to the command, it will have value `false`.
     `raw` is the raw string command.  
      See `cat` and `sudo` for commands that implement this object.
2. There are 2 ways to write output from the command. The first is to use `cli.stdout()`, the second is to return a string. The latter is preferred. The command does not have to return anything, but if it does it this should be a string (or a promise of a string/void).  
   Note that any HTML in both `cli.stdout` and return value will be rendered, though script tag will not execute (see for example `neofetch`).
3. Commands can be asynchronous and return promises. Note that async commands _are_ currently blocking. See `neofetch` for async usage.

Finally, **to be able to use the command**, add it in `commands/index.ts`. Commands not defined in this file _will not work_.
