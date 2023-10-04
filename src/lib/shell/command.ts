import type { CommandDescription, CommandFunction, NamedArgumentOptions } from './types';

export default class Command {
	fn: CommandFunction;
	description: CommandDescription;
	namedArguments: NamedArgumentOptions;

	constructor({
		command,
		description,
		namedArguments
	}: {
		command: CommandFunction;
		description: CommandDescription;
		namedArguments: NamedArgumentOptions;
	}) {
		this.fn = command;
		this.description = description;
		this.namedArguments = namedArguments;
	}
}
