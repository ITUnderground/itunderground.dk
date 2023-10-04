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
	public history: string[] = [];
	public dir: Dir = dir;
	public env: Env = env;
	public onLogUpdate: Callback;

	public dummyAccessObject: AccessObject;

	constructor(onLogUpdate: Callback) {
		this.onLogUpdate = onLogUpdate;

		this.dummyAccessObject = {
			cli: this,
			command: {
				commandName: '',
				named: {},
				positional: [],
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
	_argParser(commandString: string): ParsedCommand | null {
		const commandName = commandString.split(' ')[0];
		if (!commandName) return null;

		const commandObject = this._getCommandObject(commandName);
		if (!commandObject) return null;

		const { namedArguments: requestedArguments } = commandObject;

		const named: NamedArguments = Object.fromEntries(
			requestedArguments.map((arg) => {
				return [arg.name, false];
			})
		);
		const namedRegex = new RegExp(/ --?(\w*)(?:(?:\s+|=)(\w+))?/g);
		let z: RegExpExecArray | null;
		// cursed assignment
		while ((z = namedRegex.exec(commandString)) !== null) {
			const [rawMatch, rawName, rawValue] = z;

			// Find matching names in requested arguments
			// Name could be empty string with `rm -`. In those cases we just pass - or --
			const requestedArgumentList = requestedArguments.filter((arg) =>
				arg.choices.includes(rawName || rawMatch.split(' ')[0])
			);
			if (!requestedArgumentList.length) {
				throw new Error(
					`${commandName}: invalid option -- '${rawName}'\n` +
						`Try '${commandName} --help' for more information.`
				);
			}

			for (const requestedArgument of requestedArgumentList) {
				const value = requestedArgument.value ? rawValue : true;
				named[requestedArgument.name] = value;
			}

			// Remove match from commandString so it can be used as positional arguments
			let match = rawMatch;
			// dont remove captured value if there isn't supposed to be one
			if (requestedArgumentList.every((arg) => !arg.value)) {
				match = rawMatch.replace(rawValue, '').trim();
			}
			commandString = commandString.replace(match, '');
		}
		const positional = commandString
			.split(' ')
			.slice(1)
			.filter((arg) => arg !== '');

		return {
			commandName,
			named,
			positional,
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
		if (!(commandName in CLI.commands)) return null;
		return CLI.commands[commandName];
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
	async _execute(parsed: ParsedCommand | null): Promise<string | void> {
		// Check if valid command
		if (!parsed) return '';

		const command = this._getCommandObject(parsed.commandName);
		if (!command) return '';

		// Run command
		return await command.fn({
			command: {
				commandName: parsed.commandName,
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
	 * Runs an shell command and adds it to the log
	 * @param command string command to run
	 * @returns output of command
	 */
	async run(command: string) {
		// Get variables in case they are changed by command
		const user = env.get('USER') || 'it';
		const server = CLI.commands.hostname.fn(this.dummyAccessObject) as string;
		const cwd = dir.cwd.replace('/home/itunderground', '~');

		// Parse redirects
		let output: string | void | undefined;
		// Add to log
		this._pushlog({
			user,
			server,
			cwd,
			command
		});
		// Try to run command
		try {
			const { commands, redirect } = this._redirectParser(command);
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
		if (output) this._pushlog({ output });

		this.history.push(command);
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
		destination: ParsedCommand | null,
		redirect: string
	): Promise<string | undefined | void> {
		if (!destination) return;
		switch (redirect) {
			case '>': {
				const file = dir.read(destination.commandName);
				if (file?.type === 'Directory') return `${destination.commandName}: is a directory`;
				dir.write(destination.commandName, output);
				return;
			}
			case '>>': {
				const file = dir.read(destination.commandName);
				if (file?.type === 'Directory') return `${destination.commandName}: is a directory`;
				dir.write(destination.commandName, (file?.value || '') + output);
				return;
			}
			case '|': {
				const { commands, redirect } = this._redirectParser(destination.raw);
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
		// For now it only does directory, might add command completion later
		const full = command.split(' ').slice(-1)[0]; // Get last part of command
		const noSearch = command.split(' ').slice(0, -1).join(' '); // Remove last part of command to get command without search
		const searchTerm = full.split('/').slice(-1)[0]; // Get last part of search to get search term
		const searchDir = full.split('/').slice(0, -1).join('/'); // Remove last part of search to get directory
		const contents = dir.dir(searchDir);
		console.log(contents);
		const matches = contents.filter((file) => file.startsWith(searchTerm));
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
