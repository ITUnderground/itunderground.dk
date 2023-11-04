import { goto } from '$app/navigation';
import Command from '../command';

export default new Command({
	command() {
		goto('about:blank');
	},
	description: 'Exit the shell',
	namedArguments: []
});
