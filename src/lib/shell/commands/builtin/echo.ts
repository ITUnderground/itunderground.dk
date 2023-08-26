import type { AccessObject } from '../../types';
/**
 * Echoes a list of arguments to the console
 * @param Command object containing arguments
 * @returns string of arguments joined by spaces
 */
function echo({ command: { raw }, env }: AccessObject): string {
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
}
echo.description = 'Echoes a list of arguments to the console';

export default echo;
