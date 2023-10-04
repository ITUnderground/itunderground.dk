import Command from '../command';

export default new Command({
	command({ command: { raw }, cli }) {
		const subcommand = raw.split(' ').slice(1).join(' ');
		if (!subcommand) return 'sudo: missing command';
		const parsed = cli._argParser(subcommand);
		const output = cli._execute(parsed);
		return `<span style="color: red;">Running ${subcommand} in G A M E R M O D E: </span>\n${output}`;
	},
	description: 'Runs a command in G A M E R M O D E',
	namedArguments: []
});
