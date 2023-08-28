import type { AccessObject } from '../types';

async function sleep({ command }: AccessObject): Promise<string> {
	if (!command.positional[0]) {
		return 'sleep: missing operand';
	}
	const time = parseInt(command.positional[0]);
	if (isNaN(time)) {
		return `sleep: invalid time interval '${command.positional[0]}'`;
	}

	await new Promise((resolve) => setTimeout(resolve, time * 1000));
	return '';
}
sleep.description = 'Delay for a specified amount of time';

export default sleep;
