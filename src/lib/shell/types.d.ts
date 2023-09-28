import type CLI from './cli';
import type Command from './command';
import type Dir from './dir';
import type Env from './env';

export type Output = {
	output: string;
};
export type Input = {
	user: string;
	server: string;
	cwd: string;
	command: string;
};
/**
 * Log entry for the CLI.
 * Either define "`user`, `server`, `cwd`, and `command`" for input, "`output`" for output or both.
 */
export type LogEntry = Output | Input;

type NamedArguments = { [flag: string]: string | boolean | undefined };
export type ParsedCommand = {
	commandName: string;
	positional: string[] | undefined[];
	named: NamedArguments;
	raw: string;
};
export type AccessObject = {
	command: ParsedCommand;
	cli: CLI;
	dir: Dir;
	env: Env;
	js: (fn: (() => void) | string) => unknown | void | undefined;
};

export type Directory = { [key: string]: Directory | File };
export type File = string;

export type callback = (...args: unknown[]) => void;

type CommandFunction = (args: AccessObject) => string | void | Promise<string | void>;
type CommandDescription = string;
type NamedArgumentOptions = {
	name: string;
	choices: string[];
	value?: boolean;
}[];

type CommandImport = {
	[key: string]: Command;
};
