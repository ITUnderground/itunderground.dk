import type { AccessObject } from '../types';

function cat({ command: { positional }, dir }: AccessObject): string {
	// Get file parameter
	const requestedFile = positional[0];
	if (!requestedFile) return 'cat: missing file operand';

	// Get file
	const file = dir.read(requestedFile);
	if (!file) return `cat: ${requestedFile}: No such file or directory`;
	if (file.type === 'Directory') return `cat: ${requestedFile}: Is a directory`;

	return typeof file.value === 'string' ? file.value : '';
}
cat.description = 'Concatenate files and print on the standard output.';

export default cat;
