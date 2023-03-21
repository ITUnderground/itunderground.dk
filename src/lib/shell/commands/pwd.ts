import type { AccessObject } from '../types';

/**
 * Returns current working directory
 * @returns current working directory
 */
function pwd({ dir }: AccessObject): string {
	return dir.cwd;
}
pwd.description = 'Returns current working directory';
export default pwd;
