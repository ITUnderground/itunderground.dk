import { version } from '$app/environment';
import { formatCtfWriteups } from '$lib/dynamicFiles';

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
			'.cshrc': 'ls /home/itunderground\n' + 'cat underground\n'
		}
	}
};

export const motd = `ITUnderground v${version} Mon Aug 28 16:48:20 CST 2023 SvelteKit

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent permitted by applicable law.
Last login: ${Date().slice(0, 24)} from 127.0.0.1`;
