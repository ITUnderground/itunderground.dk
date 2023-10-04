import Command from '../command';

export default new Command({
	command({ command: { positional }, dir }) {
		// Get path parameter
		const requestedPath = positional[0];

		// Locate directory
		const directory = requestedPath ? dir.read(requestedPath) : dir.read(dir.cwd);
		if (!directory) return `ls: ${requestedPath}: No such file or directory`;
		if (directory.type === 'File') return `ls: ${requestedPath}: Not a directory`;

		// Return list of files
		return Object.entries(directory.value)
			.map(([key, value]) => {
				if (typeof value === 'string') return key;
				if (typeof value === 'object') return `<span style="color: #ec4899">${key}/</span>`;
				return key;
			})
			.join('\n');
	},
	description: 'Lists files in current directory',
	namedArguments: []
});
