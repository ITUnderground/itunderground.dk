import type { AccessObject } from '../cli';

function ls({ command: { positional }, dir }: AccessObject) {
	// Get path parameter
	const requestedPath = positional[0];
	if (!requestedPath) return dir.dir().join('\n');

	// Locate directory
	const directory = dir.get(requestedPath);
	if (!directory) return `ls: ${requestedPath}: No such file or directory`;
	if (directory.type === 'File') return `ls: ${requestedPath}: Not a directory`;

	// Return list of files
	return Object.keys(directory.value).join('\n');
}
ls.description = 'Lists files in current directory';

export default ls;
