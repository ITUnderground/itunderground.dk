import Command from '../command';
import type { CommandFunction, NamedArgumentOptions } from '../types';

const help = `cd: cd [-L|[-P [-e]] [-@]] [dir]
	Change the shell working directory.
	
	Change the current directory to DIR.  The default DIR is the value of the
	HOME shell variable.
	
	The variable CDPATH defines the search path for the directory containing
	DIR.  Alternative directory names in CDPATH are separated by a colon (:).
	A null directory name is the same as the current directory.  If DIR begins
	with a slash (/), then CDPATH is not used.
	
	If the directory is not found, and the shell option \`cdable_vars' is set,
	the word is assumed to be  a variable name.  If that variable has a value,
	its value is used for DIR.
	
	Options:
	-L	force symbolic links to be followed: resolve symbolic
		links in DIR after processing instances of \`..'
	-P	use the physical directory structure without following
		symbolic links: resolve symbolic links in DIR before
		processing instances of \`..'
	-e	if the -P option is supplied, and the current working
		directory cannot be determined successfully, exit with
		a non-zero status.
	-@	on systems that support it, present a file with extended
		attributes as a directory containing the file attributes
	
	The default is to follow symbolic links, as if \`-L' were specified.
	\`..' is processed by removing the immediately previous pathname component
	back to a slash or the beginning of DIR.

	Exit Status:
	Returns 0 if the directory is changed, and if $PWD is set successfully when
	-P is used; non-zero otherwise.`;

const cd: CommandFunction = ({ command: { positional, named }, dir, env }) => {
	if (named.help) return help;

	const requestedPath = positional[0]?.replace('~', env.get('HOME') ?? '/');
	if (!requestedPath) {
		dir.cwd = env.get('HOME') ?? '/';
		return;
	}

	const absolute = dir.getAbsolutePath(requestedPath);
	// Check if path exists
	const resolved = dir._locate(absolute);
	if (resolved === null || typeof resolved !== 'object')
		return `cd: ${requestedPath}: No such file or directory`;
	// Navigate to path
	dir.cwd = requestedPath;
};
const description = 'Changes current working directory';
const namedArguments: NamedArgumentOptions = [
	{
		name: 'help',
		choices: ['h', 'help']
	}
];

export default new Command({
	command: cd,
	description,
	namedArguments
});
