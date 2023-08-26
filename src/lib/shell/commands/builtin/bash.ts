import type { AccessObject } from '../../types';

/**
 * Executes a command
 */
function bash({ command: { raw }, cli }: AccessObject) {
	const command = raw.split(' ').slice(1).join(' ');
	if (!command) return 'bash: missing command';
	const parsed = cli._argParser(command);
	return cli._execute(parsed);
}
bash.description = 'Executes a command';

export default bash;
