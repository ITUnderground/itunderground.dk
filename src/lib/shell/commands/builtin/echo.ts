import Command from '../../command';

export default new Command({
	command: ({ command: { raw }, env }) => {
		// Remove starting/ending quotes
		raw = raw.replace(/^"|'|"|'$/g, '');
		const words = raw.split(' ').slice(1);
		// Replace environment variables
		for (let i = 0; i < words.length; i++) {
			const word = words[i];
			if (word.startsWith('$')) {
				const envVar = env.get(word.slice(1));
				if (envVar === null) {
					words[i] = '';
					continue;
				}
				words[i] = envVar;
			}
		}
		return words.join(' ');
	},
	description: 'Echoes a list of arguments to the console',
	namedArguments: []
});
