import type { AccessObject } from '../types';

/**
 * Removes a file or directory
 */
function rm({ command: { positional, named }, dir }: AccessObject) {
	const recursive = Object.keys(named).some((flag) => ['r', 'R', 'recursive'].includes(flag))
		? named.r || named.R || named.recursive || true // The flag may exist, but with an empty value which is falsy
		: false;
	const requestedDir = positional[0] || recursive; // If there is no positional argument, it was probably passed after the recursive flag
	if (typeof requestedDir !== 'string') return 'rm: missing operand';

	const readDir = dir.read(requestedDir);

	// Check if file or directory exists
	if (!readDir) return `rm: cannot remove '${requestedDir}': No such file or directory`;

	// Check if directory and recursive flag is not set
	if (readDir.type === 'Directory' && !recursive)
		return `rm: cannot remove '${requestedDir}': Is a directory`;

	// Remove file or directory
	dir.rm(requestedDir);
}
rm.description = 'Remove files or directories';

export default rm;
