import type CLI from './cli';
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

export type ParsedCommand = {
	command: string;
	positional: string[];
	named: { [key: string]: string };
	raw: string;
};
export type AccessObject = {
	command: {
		name: string;
		positional: string[] | undefined[];
		named: { [flag: string]: string };
		raw: string;
	};
	cli: CLI;
	dir: Dir;
	env: Env;
	js: (fn: (() => void) | string) => unknown | void | undefined;
};

export type Directory = { [key: string]: Directory | File };
export type File = string;
