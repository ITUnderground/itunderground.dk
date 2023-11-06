import Command from '../command';

const help = `Usage: ls [OPTION]... [FILE]...
List information about the FILEs (the current directory by default).

Mandatory arguments to long options are mandatory for short options too.
  -a, --all                  do not ignore entries starting with .
  -l                         use a long listing format
      --help     display this help and exit`;

export default new Command({
	command({ command: { positionalArguments, namedArguments }, dir }) {
		if (namedArguments.help) return help;

		// Get path parameter
		const requestedPath = positionalArguments[0];

		// Locate directory
		const directory = requestedPath ? dir.read(requestedPath) : dir.read(dir.cwd);
		if (!directory) return `ls: ${requestedPath}: No such file or directory`;
		if (directory.type === 'File') return `ls: ${requestedPath}: Not a directory`;

		// Return list of files
		return Object.entries(directory.value)
			.map(([key, value]) => {
				if (typeof value === 'string' && !namedArguments.all && key.startsWith('.')) return;
				if (typeof value === 'string') return key;
				if (typeof value === 'object') return `<span style="color: #ec4899">${key}/</span>`;
				return key;
			})
			.sort()
			.join('\n');
	},
	description: 'Lists files in current directory',
	namedArguments: [
		{
			name: 'help',
			choices: ['h', 'help']
		},
		{
			name: 'all',
			choices: ['a', 'all']
		}
	]
});
