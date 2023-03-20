import * as prebuilt from './commands/builtin/index';
import * as custom from './commands/index';
import Dir from './dir';
import Env from './env';

type Output = {
	output: string;
};
type Input = {
	user: string;
	server: string;
	cwd: string;
	command: string;
};
/**
 * Log entry for the CLI.
 * Either define "`user`, `server`, `cwd`, and `command`" for input, "`output`" for output or both.
 */
type LogEntry = Output | Input;

type ParsedCommand = {
	command: string;
	positional: string[];
	named: { [key: string]: string };
	raw: string;
};
type AccessObject = {
	command: {
		positional: string[];
		named: { [key: string]: string };
		raw: string;
	};
	cli: CLI;
	dir: Dir;
	env: Env;
	js: (fn: () => void) => any;
};

// Dir object for directory structure
const env = new Env({
	HOME: '/home/itunderground'
});
const dir = new Dir(env);

class CLI {
	public static commands: typeof prebuilt & typeof custom = { ...prebuilt, ...custom };
	public log: LogEntry[] = [];
	public dir = dir;

	/**
	 * Extracts arguments from an itush command
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
	 * Executes a ParsedCommand
	 * @param parsed ParsedCommand to execute
	 * @returns output of command
	 */
	_execute(parsed: ParsedCommand | null): string | undefined {
		// Check if valid command
		if (!parsed) return '';
		if (!(parsed.command in CLI.commands)) return `${parsed.command}: command not found`;

		// Run command
		//@ts-ignore fuck you ts let me overflow
		return CLI.commands[parsed.command as keyof typeof CLI.commands]({
			command: {
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
	js(fn: () => void) {
		// const newScript = document.createElement("script")
		// const inlineScript = document.createTextNode(`(${fn.toString()})()`)
		// newScript.appendChild(inlineScript);
		// document.body.appendChild(newScript);
		// Return the same thing as the function
		return fn();
	}

	/**
	 * Runs an itush command and adds it to the log
	 * @param command string command to run
	 * @returns output of command
	 */
	run(command: string) {
		// Get variables in case they are changed by command
		const user = CLI.commands.whoami();
		const server = CLI.commands.hostname();
		const cwd = dir.cwd.replace('/home/itunderground', '~');

		// Run command
		const parsed = this._argParser(command);
		const output = this._execute(parsed);

		this.log.push({
			user,
			server,
			cwd,
			command,
			output: output || ''
		});
		return output;
	}

	/**
	 * Logs to stdout
	 * @param args arguments to log
	 */
	stdout(...args: any[]) {
		this.log.push({
			output: args.join(' ')
		});
	}
}

export type { LogEntry, ParsedCommand, AccessObject };
export default CLI;
