import Command from '../command';

export default new Command({
	command({ dir, command: { positional } }) {
		const requestedPath = positional[0];
		if (!requestedPath) return 'touch: missing file operand';

		// Check if path exists. If it does, ignore it
		const resolved = dir.read(requestedPath);
		if (resolved) return;
		// Create a new file
		dir.write(requestedPath, '');
	},
	description: 'Creates an empty file',
	namedArguments: []
});
