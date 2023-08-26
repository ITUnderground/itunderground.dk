import type { AccessObject } from '../types';

/**
 * Returns the current user
 * @returns current user
 */
function whoami({ env }: AccessObject): string {
	return env.get('USER') ?? 'it';
}
whoami.description = 'Returns the current user';

export default whoami;
