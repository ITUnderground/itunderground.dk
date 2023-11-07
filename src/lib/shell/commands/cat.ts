import Command from '../command';

const help = `Usage: cat [OPTION]... [FILE]...
Concatenate FILE(s) to standard output.

With no FILE, or when FILE is -, read standard input.

  -n, --number             number all output lines
      --help        display this help and exit

Examples:
  cat        Copy standard input to standard output.

GNU coreutils online help: <https://www.gnu.org/software/coreutils/>
Full documentation <https://www.gnu.org/software/coreutils/cat>
or available locally via: info '(coreutils) cat invocation'`;

export default new Command({
	command({ command: { positionalArguments, namedArguments }, dir }) {
		if (namedArguments['help']) return help;
		// Get file parameter
		const requestedFile = positionalArguments[0];
		if (!requestedFile) return 'cat: missing file operand';

		// Get file
		const file = dir.read(requestedFile);
		if (!file) return `cat: ${requestedFile}: No such file or directory`;
		if (file.type === 'Directory') return `cat: ${requestedFile}: Is a directory`;

		return (() => {
			if (typeof file.value !== 'string') return '';

			const content = file.value.split('\n');
			if (namedArguments['number']) {
				return content.map((line, index) => `${index + 1} ${line}`).join('\n');
			}
			return content.join('\n');
		})();
	},
	description: 'Concatenate files and print on the standard output.',
	namedArguments: [
		{
			name: 'help',
			choices: ['h', 'help']
		},
		{
			name: 'number',
			choices: ['n', 'number']
		}
	]
});
