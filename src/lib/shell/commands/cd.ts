import type { AccessObject } from '../types';

function cd({ command: { positional }, dir, env }: AccessObject) {
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
}
cd.description = 'Changes current working directory';

export default cd;
