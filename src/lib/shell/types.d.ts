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

type NamedArguments = { [flag: string]: string[] | boolean };
export type ParsedCommand = {
	name: string;
	positionalArguments: string[] | undefined[];
	namedArguments: NamedArguments;
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
	hasValue?: boolean;
}[];

type CommandImport = {
	[key: string]: Command;
};

type ThemeName = 'papermod' | 'catppuccin-mocha';
type CustomTheme = {
	brand: string;
	h1: string;
	h2: string;
	h3: string;
	h4: string;
	h5: string;
	h6: string;
	content: string;
	border: string;
	separator: string;
	background: string;
	muted: string;
	bold: string;
	italic: string;
	link: string;
	visited: string;
	linkHover: string;
	success: string;
	warning: string;
	error: string;
	selected: string;
};
