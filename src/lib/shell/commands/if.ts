import Command from '../command';

const help = `if: if [expr] [options]
Evaluate conditional expression and run commands based on the result.

options:
  -t, --then      Run if expr is true
  -e, --else      Run if expr is false

The same option can be used multiple times to run multiple commands.

Examples:
  if "test -a flag.txt" --then "echo 'You found the flag!'" --else "echo 'You didn't find the flag :('"
  if "test 2+2 == 4" -t "echo '2+2 is 4'" -e "echo '2+2 is not 4'"
  if "test -a file.txt" -e "echo 'created file' > file.txt"
`;

export default new Command({
	async command({ command: { positionalArguments, namedArguments }, cli }) {
		if (namedArguments.help) return help;

		const expr = positionalArguments[0];
		if (!expr) throw new Error('No expression provided');
		const thenCommands = namedArguments.then as string[];
		const elseCommands = namedArguments.else as string[];
		if (!thenCommands.length && !elseCommands.length) throw new Error('No commands provided');
		const quiet = namedArguments.quiet == true;

		const res = await cli.run(expr, true);
		console.log(res, thenCommands, elseCommands);
		if ((res === 'true' || res) && thenCommands.length) {
			await Promise.all(thenCommands.map(async (command) => await cli.run(command, quiet)));
		}
		if ((res === 'false' || !res) && elseCommands.length) {
			await Promise.all(elseCommands.map(async (command) => await cli.run(command, quiet)));
		}
	},
	description:
		'Evaluate a test command and runs one or more commands based on whether the result is true or false',
	namedArguments: [
		{
			name: 'help',
			choices: ['help', 'h']
		},
		{
			name: 'then',
			choices: ['then', 't'],
			hasValue: true
		},
		{
			name: 'else',
			choices: ['else', 'e'],
			hasValue: true
		},
		{
			name: 'quiet',
			choices: ['quiet', 'q']
		}
	]
});
