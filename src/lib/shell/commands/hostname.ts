import Command from '../command';

export default new Command({
	command() {
		return 'underground';
	},
	description: 'Returns the server hostname',
	namedArguments: []
});
