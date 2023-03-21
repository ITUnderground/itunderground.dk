import type { AccessObject } from '../cli';

function ls({ command: { positional }, dir }: AccessObject) {
	// Get path parameter
	const requestedPath = positional[0];

    // Locate directory
	const directory = requestedPath ? dir.get(requestedPath) : dir.get(dir.cwd);
	if (!directory) return `ls: ${requestedPath}: No such file or directory`;
	if (directory.type === 'File') return `ls: ${requestedPath}: Not a directory`;

	// Return list of files
    return Object.entries(directory.value).map(([key, value]) => {
        if (typeof value === 'string') return key;
        if (typeof value === 'object') return `<span style="color: #3b78ff">${key}/</span>`;
        return key;
    }).join('\n');
}
ls.description = 'Lists files in current directory';

export default ls;
