import Command from '../command';

export default new Command({
	command({ cli }) {
		const highestIndex = cli.history.length;
		return cli.history
			.map((command, index) => {
				const num = String(index + 1).padStart(String(highestIndex).length + 2, ' ');
				return `${num}  ${command}`;
			})
			.join('\n');
	},
	description: 'Returns a list of previous commands',
	namedArguments: []
});
