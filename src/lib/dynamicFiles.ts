function ctfWriteups() {
	type Module = {
		metadata: {
			title: string;
			shortTitle?: string;
			date?: string;
			length?: string;
			author?: string;
			headline?: string;
		};
	};

	const ctfFiles = import.meta.glob('../routes/\\(posts\\)/blog/writeups/*/*.md', { eager: true });
	const writeupFiles = import.meta.glob('../routes/\\(posts\\)/blog/writeups/*/*/*.md', {
		eager: true
	});

	const ctfWriteupsObj: {
		[ctf: string]: {
			absPath: string;
			module: Module;
			writeups: {
				[writeup: string]: {
					absPath: string;
					module: Module;
				};
			};
		};
	} = {};
	for (const path in ctfFiles) {
		const pathEls = path.split('/');
		const ctf = pathEls[pathEls.length - 2];

		ctfWriteupsObj[ctf] = {
			absPath: '/' + pathEls.slice(3, 6).join('/'),
			module: ctfFiles[path] as Module,
			writeups: {}
		};
	}
	for (const path in writeupFiles) {
		const pathEls = path.split('/');
		const ctf = pathEls[pathEls.length - 3];
		const writeup = pathEls[pathEls.length - 2];

		ctfWriteupsObj[ctf].writeups[writeup] = {
			absPath: '/' + pathEls.slice(3, 7).join('/'),
			module: writeupFiles[path] as Module
		};
	}

	return ctfWriteupsObj;
}

// Auto-generated writeups. Final output should look like:
// └── <a href="/blog/writeups/fectf23-qualifiers">FE CTF 2023 - The UniPwnie Experience</a>
//     ├── <a href="/blog/writeups/fectf23-qualifiers/admin-cli">Admin CLI</a>
//     ├── <a href="/blog/writeups/fectf23-qualifiers/inception">Inception</a>
//     └── <a href="/blog/writeups/fectf23-qualifiers/padding-oracle">Padding Oracle</a>
//TODO: Support for multiple CTFs
const formatCtfWriteups = () =>
	Object.values(ctfWriteups())
		.map(({ absPath, module, writeups }, index, array) => {
			// Lines are different for the final writeup
			const lvl1Char = index === array.length - 1 ? '└' : '├';
			const lvl2Char = index === array.length - 1 ? ' ' : '│';

			// Go through every ctf...
			const writeupsList = Object.values(writeups).map(({ absPath, module }) => {
				/// And every writeup in that ctf
				const metadata = module.metadata;
				return `${lvl2Char}   ├── <a href="${absPath}">${metadata.shortTitle || metadata.title}</a>\n`;
			});
			// Replace the last '├──' with '└──'
			writeupsList[writeupsList.length - 1] = writeupsList[writeupsList.length - 1].replace(
				'├──',
				'└──'
			);
			return `${lvl1Char}── <a href="${absPath}">${module.metadata.shortTitle}</a>\n${writeupsList.join('')}`;
		})
		.join('');

console.log(formatCtfWriteups())

export { ctfWriteups, formatCtfWriteups };
