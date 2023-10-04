import Command from '../command';

export default new Command({
	command({ dir }) {
		return dir.cwd;
	},
	description: 'Returns current working directory',
	namedArguments: []
});
