import Command from '../command';

export default new Command({
	command({ dir }) {
		dir._recoverFilesystem();
		// Funny message
		return (
			'<span style="color: red">\n' +
			'wow you really did it. you really deleted the filesystem.\n' +
			'you really thought that was a good idea.</span>'
		);
	},
	description: 'Resets the filesystem in case you did something stupid',
	namedArguments: []
});
