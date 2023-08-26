import type { AccessObject } from '../types';

function touch({ dir, command: { positional } }: AccessObject) {
	const requestedPath = positional[0];
	if (!requestedPath) return 'touch: missing file operand';

	// Check if path exists. If it does, ignore it
	const resolved = dir.read(requestedPath);
	if (resolved) return;
	// Create a new file
	dir.write(requestedPath, '');
}
touch.description = 'Changes current working directory';

export default touch;
