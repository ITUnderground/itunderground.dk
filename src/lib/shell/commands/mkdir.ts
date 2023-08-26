import type { AccessObject } from '../types';

/**
 * Creates a directory
 */
function mkdir({ command: { positional }, dir }: AccessObject) {
	const requestedDir = positional[0];
	if (!requestedDir) return 'mkdir: missing operand';
	const parentDir = requestedDir.split('/').slice(0, -1).join('/');
	// Check if parent folders exist
	if (!dir.read(parentDir))
		return `mkdir: cannot create directory ‘${requestedDir}’: Not a directory`;
	// Check if dir or file already exists
	if (dir.read(requestedDir))
		return `mkdir: cannot create directory ‘${requestedDir}’: File exists`;
	// Create directory
	dir.write(requestedDir, {});
}
mkdir.description = 'Make directories';

export default mkdir;
