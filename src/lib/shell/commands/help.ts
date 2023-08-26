import CLI from '../cli';

function help(): string {
	// Get commands
	const commands = CLI.commands;

	return Object.keys(commands)
		.map((command) => {
			return `${command} - ${commands[command as keyof typeof commands].description}`;
		})
		.join('\n');
}
help.description = 'Returns a list of commands';

export default help;
