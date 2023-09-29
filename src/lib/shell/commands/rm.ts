import Command from '../command';
import type { CommandDescription, CommandFunction, NamedArgumentOptions } from '../types';

const command: CommandFunction = ({ command: { positional, named }, dir }) => {
	const recursive = named.recursive;
	const requestedDir = positional[0];

	if (typeof requestedDir !== 'string') return 'rm: missing operand';

	const readDir = dir.read(requestedDir);

	// Check if file or directory exists
	if (!readDir) return `rm: cannot remove '${requestedDir}': No such file or directory`;

	// Check if directory and recursive flag is not set
	if (readDir.type === 'Directory' && !recursive)
		return `rm: cannot remove '${requestedDir}': Is a directory`;

	// Remove file or directory
	dir.rm(requestedDir);
};
const description: CommandDescription = 'Remove files or directories';
const namedArguments: NamedArgumentOptions = [
	{
		name: 'recursive',
		choices: ['r', 'R', 'recursive', 'rf', 'fr']
	},
	{
		name: 'force',
		choices: ['f', 'force', 'rf', 'fr']
	}
];

export default new Command({
	command,
	description,
	namedArguments
});
