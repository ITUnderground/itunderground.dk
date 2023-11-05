import Command from '../command';

export default new Command({
	async command({ command }) {
		if (!command.positionalArguments[0]) {
			return 'sleep: missing operand';
		}
		const time = parseInt(command.positionalArguments[0]);
		if (isNaN(time)) {
			return `sleep: invalid time interval '${command.positionalArguments[0]}'`;
		}

		await new Promise((resolve) => setTimeout(resolve, time * 1000));
		return '';
	},
	description: 'Delay for a specified amount of time',
	namedArguments: []
});
