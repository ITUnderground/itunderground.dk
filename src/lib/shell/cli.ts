import { history as historyStore } from '$lib/stores';
import { get } from 'svelte/store';
import type Command from './command';
import * as _baseCommands from './commands/builtin/index';
import * as _customCommands from './commands/index';
import Dir from './dir';
import Env from './env';
import type {
	LogEntry,
	ParsedCommand,
	callback as Callback,
	AccessObject,
	CommandImport,
	NamedArguments
} from './types';

const baseCommands = _baseCommands as CommandImport;
const customCommands = _customCommands as CommandImport;

// Env object for environment variables
const env = new Env({
	HOME: '/home/itunderground',
	USER: 'it',
	START_TIME: `${Date.now()}`
});
// Dir object for directory structure
const dir = new Dir(env);

class CLI {
	public static commands: typeof baseCommands & typeof customCommands = {
		...baseCommands,
		...customCommands
	};
	public log: LogEntry[] = [];
	public history: string[] = get(historyStore);
	public dir: Dir = dir;
	public env: Env = env;
	public onLogUpdate: Callback;

	public dummyAccessObject: AccessObject;

	constructor(onLogUpdate: Callback) {
		this.onLogUpdate = onLogUpdate;

		this.dummyAccessObject = {
			cli: this,
			command: {
				name: '',
				namedArguments: {},
				positionalArguments: [],
				raw: ''
			},
			dir,
			env,
			js: this.js.bind(this)
		};
	}

	/**
	 * Extracts arguments from an shell command
	 * @param commandString string command to extract arguments from
	 */
	_argParser(commandString: string): ParsedCommand {
		const commandName = commandString.split(' ')[0];
		if (!commandName) throw new Error('No command name provided');

		const commandObject = this._getCommandObject(commandName);
		if (!commandObject) throw new Error(`${commandName}: command not found`);

		const { namedArguments: supportedNamedArguments } = commandObject;

		let args = commandString.split(' ').slice(1).join(' ');
		const argMatcher = /(?:"([^"]*)"|'([^']*)'|([^=\s]+))/; // Matches "a b", a, -a, --a, etc.
		const namedMatcher = /-{1,2}([^=\s]+)/; // Matches -a, --a, --a=, --a, etc.
		const nextArg = (del?: boolean) => {
			const match = args.match(argMatcher);
			1;
			if (!match) return null;
			// Remove the matched arg from the string
			if (del) args = args.replace(argMatcher, '').trim();

			return match[1] ?? match[2] ?? match[3];
		};

		// Initialise all arguments to false
		const namedArgumentValues: NamedArguments = Object.fromEntries(
			supportedNamedArguments.map((arg) => {
				return [arg.name, arg.hasValue ? [] : false];
			})
		);
		const positionalArgumentValues: string[] = [];

		let z: string | null = null;
		while ((z = nextArg(true)) !== null) {
			// Named
			if (z.startsWith('-')) {
				let match = z.match(namedMatcher);
				match ||= ['-', '-'];
				const name = match[1];

				// Check if the named arg is supported
				const supported = supportedNamedArguments.find((arg) => arg.choices.includes(name));
				if (!supported) throw new Error(`${name}: invalid argument`);

				const value: string | boolean | null = nextArg(false);
				// If the argument requires a value but none is provided
				if (
					supported.hasValue &&
					(value === null || (typeof value === 'string' && value.startsWith('-')))
				)
					throw new Error(`${name}: argument requires value`);
				if (supported.hasValue) nextArg(true); // Remove the value from the string

				if (supported.hasValue) {
					(namedArgumentValues[supported.name] as string[]).push(value || '');
				} else {
					namedArgumentValues[supported.name] = true;
				}
				continue;
			}
			// Positional
			positionalArgumentValues.push(z);
		}

		return {
			name: commandName,
			namedArguments: namedArgumentValues,
			positionalArguments: positionalArgumentValues,
			raw: commandString
		};
	}

	/**
	 * Gets a command object from the commands object
	 * @param commandName Name of command to get
	 * @returns Command object or null if not found
	 */
	_getCommandObject(commandName: string): Command | null {
		// Check if command exists
		if (!(commandName in CLI.commands))
			throw new Error(`${commandName}: command not found\nTry 'help' for more information.`);

		return CLI.commands[commandName];
	}

	/**
	 * Parses first instance of > or >> redirect in a command
	 * @param command String command to parse
	 * @returns ParsedCommand[] and redirects
	 */
	_redirectParser(command: string): {
		commandOrFilePath: [ParsedCommand | null, string | null];
		redirect: string | null;
	} {
		// Supports >, >>, and |, but not inside quotes
		const regex = /(>{1,2}|\|)(?=([^"']*["'][^"']*["'])*[^"']*$)/g;
		const match = command.match(regex);
		if (!match) return { commandOrFilePath: [this._argParser(command), null], redirect: null };
		const redirect = match[0];
		const command1 = command.split(redirect)[0].trim();
		const maybecommand = command.split(redirect).slice(1).join(redirect).trim();

		return {
			commandOrFilePath: [this._argParser(command1), maybecommand],
			redirect
		};
	}

	/**
	 * Executes a ParsedCommand
	 * @param parsed ParsedCommand to execute
	 * @returns output of command
	 */
	async _execute(parsed: ParsedCommand | null): Promise<string | void> {
		// Check if valid command
		if (!parsed) return '';

		const command = this._getCommandObject(parsed.name);
		if (!command)
			throw new Error(`${parsed.name}: command not found\n` + `Try 'help' for more information.`);

		// Run command
		return await command.fn({
			command: {
				name: parsed.name,
				positionalArguments: parsed.positionalArguments,
				namedArguments: parsed.namedArguments,
				raw: parsed.raw
			},
			cli: this,
			dir,
			env,
			js: this.js.bind(this)
		});
	}

	_pushlog(entry: LogEntry) {
		this.log.push(entry);
		this.onLogUpdate();
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
			const res = eval(fn);
			return res;
		}
	}

	/**
	 * Runs a shell command and optionally adds it to the log
	 * @param command string command to run
	 * @param silent whether to add to log
	 * @returns output of command
	 */
	async run(command: string, silent?: boolean): Promise<string | void> {
		command = command.trim();
		silent ||= false;
		// Get variables in case they are changed by command
		const user = env.get('USER') || 'it';
		const server = CLI.commands.hostname.fn(this.dummyAccessObject) as string;
		const cwd = dir.cwd.replace('/home/itunderground', '~');

		// Parse redirects
		let output: string | void | undefined;
		// Add to log
		if (!silent)
			this._pushlog({
				user,
				server,
				cwd,
				command
			});
		if (!command) return;
		// Try to run command
		try {
			const { commandOrFilePath: commands, redirect } = this._redirectParser(command);
			// Run command
			output = await this._execute(commands[0]);
			// Redirect if needed
			if (redirect) {
				output = await this.redirect(output || '', commands[1], redirect);
			}
		} catch (e) {
			if (e instanceof Error) {
				output = e.message;
			} else {
				output = 'An error occured.';
			}
		}
		// Add to log
		if (!silent) {
			if (output) this._pushlog({ output });

			this.history.push(command);
			historyStore.set(this.history);
		}
		return output;
	}

	/**
	 * Logs to stdout
	 * @param args arguments to log
	 */
	stdout(...args: string[]) {
		this._pushlog({
			output: args.join(' ')
		});
	}

	/**
	 * Redirects text to a file
	 * @param output Text to redirect to file
	 * @param destination File to redirect to
	 * @param append Whether to append to file or overwrite. Works like `>>` (append) and `>` (overwrite) in bash
	 */
	async redirect(
		output: string,
		destination: string | null,
		redirect: string
	): Promise<string | undefined | void> {
		if (!destination) return;
		switch (redirect) {
			case '>': {
				const file = dir.read(destination);
				if (file?.type === 'Directory') return `${destination}: is a directory`;
				dir.write(destination, output + '\n');
				return;
			}
			case '>>': {
				const file = dir.read(destination);
				if (file?.type === 'Directory') return `${destination}: is a directory`;
				dir.write(destination, (file?.value || '') + output + '\n');
				return;
			}
			case '|': {
				const command = this._argParser(destination);
				const { commandOrFilePath: commands, redirect } = this._redirectParser(command.raw);
				if (!commands[0]) return;
				commands[0].raw += ' ' + output; // Redirect previous output to new command
				commands[0] = this._argParser(commands[0].raw); // Re-parse command
				if (redirect) {
					// We have a chain of redirects
					return this.redirect((await this._execute(commands[0])) || '', commands[1], redirect); // Run new command and redirect again
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
		const noSearch = command.split(' ').slice(0, -1).join(' '); // Remove last part of command to get command without search
		const full = command.split(' ').slice(-1)[0]; // Get last part of command
		const searchDir = full.split('/').slice(0, -1).join('/'); // Remove last part of search to get directory
		const searchTerm = full.split('/').slice(-1)[0]; // Get last part of search to get search term

		const matches = (() => {
			const commandMatches = Object.keys(CLI.commands).filter((command) =>
				command.startsWith(searchTerm)
			);

			// Default to showing all commands if no search term
			if (command === '') return commandMatches;

			const contents = dir.dir(searchDir);
			const fileMatches = contents.filter((file) => file.startsWith(searchTerm));

			return fileMatches.length ? fileMatches : commandMatches;
		})();

		return [`${noSearch} ${searchDir ? searchDir + '/' : ''}${matches[0]}`, matches];
	}

	/**
	 * "Runs" the current command with the given output.
	 */
	newLine(command?: string, output?: string | string[]) {
		this._pushlog({
			command: command || '',
			cwd: dir.cwd.replace('/home/itunderground', '~'),
			output: output ? (Array.isArray(output) ? output.join(' ') : output) : '',
			server: CLI.commands.hostname.fn(this.dummyAccessObject) as string,
			user: env.get('USER') || 'it'
		});
	}
}

export default CLI;
