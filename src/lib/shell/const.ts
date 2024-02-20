import { version } from '$app/environment';
import { formatCtfWriteups } from '$lib/dynamicFiles';
import type { CustomTheme } from './types';

export const defaultDir = {
	home: {
		// Folder
		itunderground: {
			// Simple file
			'flag.txt': "Did you really think it'd be that easy?",
			secret_folder: {
				'inconspicuous.txt': "You found me! Here's your flag: <code>itu{spooky}</code>"
			},
			// Multiline file
			underground:
				'├── <a href="/pages/who-are-we">who-are-we</a>\n' +
				'├── <a href="/pages/next-events">next-events</a>\n' +
				'├── <a href="/pages/discord">discord-server</a>\n' +
				'├── <a href="/pages/resources">resources</a>\n' +
				'├── <a href="/?command=cat%20blog-posts">blog-posts/</a>\n' +
				'└── <a href="/?command=cat%20writeups">writeups/</a>',
			'blog-posts':
				'└── <a href="/blog/setting-up-kali-windows">Setting up Kali Linux on Windows</a>',
			writeups: formatCtfWriteups(),
			'.cshsysrc':
				`;if "test -a .cshrc" --quiet ` +
				`--else "echo '# Welcome to the .cshrc file. Any commands that you put in here will be run when you log in, after the commands in .cshsysrc.' >> .cshrc" ` +
				`--else "echo '# While the .cshsysrc file is writeable, its contents get replaced after every site update, so .cshrc is used as a user-specific file.' >> .cshrc" ` +
				`--else "echo '# Tip: start a line with ; to make the command run silent during startup.' >> .cshrc"\n` +
				'ls /home/itunderground\n' +
				'cat underground\n'
		}
	}
};

export const motd = `ITUnderground v${version} Mon Feb 6 21:53:20 CST 2024 SvelteKit

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent permitted by applicable law.
Last login: ${Date().slice(0, 24)} from 127.0.0.1`;

export const themes: { [key: string]: CustomTheme } = {
	papermod: {
		brand: '#c97eff',
		h1: '#dadadb',
		h2: '#dadadb',
		h3: '#dadadb',
		h4: '#dadadb',
		h5: '#dadadb',
		h6: '#dadadb',
		content: '#c4c4c5',
		border: '#333',
		separator: '#414244',
		background: '#1d1e20',
		muted: '#9b9c9d',
		bold: '#c4c4c5',
		italic: '#c4c4c5',
		link: '#9cbbc8',
		visited: '#9cbbc8',
		linkHover: '#0ea5e9',
		success: '#a6e3a1',
		warning: '#f9e2af',
		error: '#f38ba8',
		selected: '#585b7080'
	},
	'catppuccin-mocha': {
		brand: '#cba6f7',
		h1: '#cdd6f4',
		h2: '#bac2de',
		h3: '#a6adc8',
		h4: '#a6adc8',
		h5: '#a6adc8',
		h6: '#a6adc8',
		content: '#cdd6f4',
		border: '#7f849c',
		separator: '#7f849c',
		background: '#1e1e2e',
		muted: '#7f849c',
		bold: '#f5c2e7',
		italic: '#fab387',
		link: '#89b4fa',
		visited: '#89b4fa',
		linkHover: '#89b4fa',
		success: '#a6e3a1',
		warning: '#f9e2af',
		error: '#f38ba8',
		selected: '#585b7080'
	}
};
