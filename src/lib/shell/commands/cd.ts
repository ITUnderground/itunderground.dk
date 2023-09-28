import Command from '../command';
import type { CommandFunction, NamedArgumentOptions } from '../types';

const cd: CommandFunction = ({ command: { positional }, dir, env }) => {
	const requestedPath = positional[0];
	if (!requestedPath) {
		dir.cwd = env.get('HOME') ?? '/';
		return;
	}

	const absolute = dir.getAbsolutePath(requestedPath);
	// Check if path exists
	const resolved = dir._locate(absolute);
	if (resolved === null || typeof resolved !== 'object')
		return `cd: ${requestedPath}: No such file or directory`;
	// Navigate to path
	dir.cwd = requestedPath;
};
const description = 'Changes current working directory';
const namedArguments: NamedArgumentOptions = [];

export default new Command({
	command: cd,
	description,
	namedArguments
});
