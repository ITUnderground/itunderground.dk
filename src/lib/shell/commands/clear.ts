import Command from '../command';

export default new Command({
	command({ cli }) {
		cli.log = [];
	},
	description: 'Clears the console',
	namedArguments: []
});
