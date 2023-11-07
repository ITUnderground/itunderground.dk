import Command from '../command';

const help = `test: test [expr]
Evaluate conditional expression.

Exits with 'true' or 'false' depending on
the evaluation of EXPR.  

File operators:

  -a FILE        True if file exists.

If no options or arguments are given,
evaluates using javascript and returns the result.
`;

export default new Command({
	command({ command: { namedArguments, positionalArguments }, dir, js }) {
		if (namedArguments.help) return help;

		namedArguments.a = namedArguments.a as string[];
		if (namedArguments.a.length) {
			const fileToCheck = `${namedArguments.a[0]}`.trim();
			const file = dir.read(fileToCheck);

			if (file) {
				return 'true';
			} else {
				return 'false';
			}
		}

		if (positionalArguments.length === 0) return;

		return `${js(positionalArguments.join(' '))}`;
	},
	description: 'Evaluate a conditional expression',
	namedArguments: [
		{
			name: 'a',
			choices: ['a'],
			hasValue: true
		},
		{
			name: 'help',
			choices: ['help', 'h']
		}
	]
});
