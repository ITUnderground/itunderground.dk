import Command from '../command';

export default new Command({
	command({ env }) {
		return env.get('USER') ?? 'it';
	},
	description: 'Returns the current user',
	namedArguments: []
});
