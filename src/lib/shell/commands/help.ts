import CLI from '../cli';
import Command from '../command';

export default new Command({
	command() {
		// Get commands
		const commands = CLI.commands;

		return Object.keys(commands)
			.map((command) => {
				return `${command} - ${commands[command as keyof typeof commands].description}`;
			})
			.join('\n');
	},
	description: 'Returns a list of commands',
	namedArguments: []
});
