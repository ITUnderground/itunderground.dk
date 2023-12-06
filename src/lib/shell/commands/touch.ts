import Command from '../command';

export default new Command({
	command({ dir, command: { positionalArguments: positional } }) {
		const requestedPath = positional[0];
		if (!requestedPath) return 'touch: missing file operand';

		// 🥚 easter egg
		if (requestedPath.toLowerCase() === 'woman')
			throw Error(`touch: cannot touch 'woman': Permission denied`);

		// Check if path exists. If it does, ignore it
		const resolved = dir.read(requestedPath);
		if (resolved) return;
		// Create a new file
		dir.write(requestedPath, '');
	},
	description: 'Creates an empty file',
	namedArguments: []
});
