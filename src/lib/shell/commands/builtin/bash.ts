import Command from '../../command';

export default new Command({
	command: ({ command: { raw }, cli }) => {
		const command = raw.split(' ').slice(1).join(' ');
		if (!command) return 'bash: missing command';
		const parsed = cli._argParser(command);
		return cli._execute(parsed);
	},
	description: 'Executes a command',
	namedArguments: []
});
