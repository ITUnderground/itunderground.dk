import * as prebuilt from './commands/builtin/index';
import * as custom from './commands/index';
import Dir from './dir';
import Env from './env';
import type { LogEntry, ParsedCommand } from './types';

// Dir object for directory structure
const env = new Env({
	HOME: '/home/itunderground',
	USER: 'it',
	START_TIME: `${Date.now()}`
});
const dir = new Dir(env);

class CLI {
	public static commands: typeof prebuilt & typeof custom = { ...prebuilt, ...custom };
	public log: LogEntry[] = [];
	public history: string[] = [];
	public dir: Dir = dir;
	public env: Env = env;

	/**
	 * Extracts arguments from an shell command
	 * @param command string command to extract arguments from
	 */
	_argParser(command: string): ParsedCommand | null {
		/* Example: "command arg1 -a b -c d --named argument -a=1 --named2=equals -x" becomes
		 * {
		 *   command: "command",
		 *   positional: ["arg1"],
		 *   named: {
		 *     a: "b",
		 *     c: "d",
		 *     named: "argument",
		 *     a: "1",
		 *     named2: "equals",
		 *     x: ""
		 *   }
		 * }
		 */
		const args = command.split(' ');
		const main = args[0];
		const named: { [key: string]: string } = {};
		const positional: string[] = [];
		// Regex matches -a, --a, -a1, --a1, etc.
		const namedRegex = /--?[a-zA-Z0-9]*/g;

		// Loop through arguments
		for (let i = 1; i < args.length; i++) {
			const arg = args[i];
			if (!arg.match(namedRegex) && !args[i - 1].match(namedRegex)) {
				positional.push(arg);
				continue;
			}
			// Check if using = or space
			const [name, value] = arg.includes('=')
				? arg.split('=')
				: // If we're using a space, check if the next argument is another argument or a value
				  [arg, args[i + 1] && !args[i + 1].match(namedRegex) ? args[i + 1] : ''];
			named[name.replace(/-+/g, '')] = value || '';
		}

		return main
			? {
					command: main,
					positional,
					named,
					raw: command
			  }
			: null;
	}

	/**
	 * Parses first instance of > or >> redirect in a command
	 * @param command String command to parse
	 * @returns ParsedCommand[] and redirects
	 */
	_redirectParser(command: string): {
		commands: [ParsedCommand | null, ParsedCommand | null];
		redirect: string | null;
	} {
		// Supports >, >>, and |
		const regex = />{1,2}|\|/g;
		const match = command.match(regex);
		if (!match) return { commands: [this._argParser(command), null], redirect: null };
		const redirect = match[0];
		const command1 = command.split(redirect)[0].trim();
		const command2 = command.split(redirect).slice(1).join(redirect).trim();

		return {
			commands: [this._argParser(command1), this._argParser(command2)],
			redirect
		};
	}

	/**
	 * Executes a ParsedCommand
	 * @param parsed ParsedCommand to execute
	 * @returns output of command
	 */
	_execute(parsed: ParsedCommand | null): string | undefined | void {
		// Check if valid command
		if (!parsed) return '';
		if (!(parsed.command in CLI.commands)) return `${parsed.command}: command not found`;

		// Run command
		return CLI.commands[parsed.command as keyof typeof CLI.commands]({
			command: {
				name: parsed.command,
				positional: parsed.positional,
				named: parsed.named,
				raw: parsed.raw
			},
			cli: this,
			dir,
			env,
			js: this.js.bind(this)
		});
	}

	/**
	 * Runs a javascript function in the browser
	 * @param fn function to run
	 */
	js(fn: (() => void) | string) {
		// const newScript = document.createElement("script")
		// const inlineScript = document.createTextNode(`(${fn.toString()})()`)
		// newScript.appendChild(inlineScript);
		// document.body.appendChild(newScript);
		// Return the same thing as the function
		if (typeof fn === 'function') return fn();
		else {
			console.log('evaling: ' + fn);
			const res = eval(fn);
			console.log('eval result: ' + res);
			return res;
		}
	}

	/**
	 * Runs an shell command and adds it to the log
	 * @param command string command to run
	 * @returns output of command
	 */
	run(command: string) {
		// Get variables in case they are changed by command
		const user = env.get('USER') || 'it';
		const server = CLI.commands.hostname();
		const cwd = dir.cwd.replace('/home/itunderground', '~');

		// Parse redirects
		const { commands, redirect } = this._redirectParser(command);
		// Run command
		let output = this._execute(commands[0]);
		// Redirect if needed
		if (redirect) {
			output = this.redirect(output || '', commands[1], redirect);
		}

		// Add to log
		this.log.push({
			user,
			server,
			cwd,
			command,
			output: output || ''
		});
		this.history.push(command);
		return output;
	}

	/**
	 * Logs to stdout
	 * @param args arguments to log
	 */
	stdout(...args: string[]) {
		this.log.push({
			output: args.join(' ')
		});
	}

	/**
	 * Redirects text to a file
	 * @param output Text to redirect to file
	 * @param destination File to redirect to
	 * @param append Whether to append to file or overwrite. Works like `>>` (append) and `>` (overwrite) in bash
	 */
	redirect(
		output: string,
		destination: ParsedCommand | null,
		redirect: string
	): string | undefined | void {
		if (!destination) return;
		switch (redirect) {
			case '>': {
				const file = dir.read(destination.command);
				if (file?.type === 'Directory') return `${destination.command}: is a directory`;
				dir.write(destination.command, output);
				return;
			}
			case '>>': {
				const file = dir.read(destination.command);
				if (file?.type === 'Directory') return `${destination.command}: is a directory`;
				dir.write(destination.command, (file?.value || '') + output);
				return;
			}
			case '|': {
				const { commands, redirect } = this._redirectParser(destination.raw);
				if (!commands[0]) return;
				commands[0].raw += ' ' + output; // Redirect previous output to new command
				commands[0] = this._argParser(commands[0].raw); // Re-parse command
				if (redirect) {
					// We have a chain of redirects
					return this.redirect(this._execute(commands[0]) || '', commands[1], redirect); // Run new command and redirect again
				}
				return this._execute(commands[0]); // Run new command
			}
		}
	}

	/**
	 * Auto-completes a command based on the current directory
	 * @param command Command to complete
	 * @returns {[string, string[]]} Array of possible string completions
	 */
	complete(command: string): [string, string[]] {
		// For now it only does directory, might add command completion later
		const full = command.split(' ').slice(-1)[0]; // Get last part of command
		const noSearch = command.split(' ').slice(0, -1).join(' '); // Remove last part of command to get command without search
		const searchDir = full.split('/').slice(0, -1).join('/'); // Remove last part of search to get directory
		const searchTerm = full.split('/').slice(-1)[0]; // Get last part of search to get search term
		const files = dir.dir(searchDir);
		const matches = files.filter((file) => file.startsWith(searchTerm));
		return [`${noSearch} ${searchDir ? searchDir + '/' : ''}${matches[0]}`, matches];
	}

	/**
	 * "Runs" the current command with the given output.
	 */
	newLine(command?: string, output?: string | string[]) {
		this.log.push({
			command: command || '',
			cwd: dir.cwd.replace('/home/itunderground', '~'),
			output: output ? (Array.isArray(output) ? output.join(' ') : output) : '',
			server: CLI.commands.hostname(),
			user: env.get('USER') || 'it'
		});
	}
}

export default CLI;
