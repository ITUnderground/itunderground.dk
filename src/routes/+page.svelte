<script>
	import Shell from '$lib/components/Shell.svelte';
	import { version } from '$app/environment';

	const cwd = '/home/itunderground';
	const server = 'itunderground';
	const user = 'itunderground';

	/**
	 * @type {import('$lib/shell/cli').LogEntry[]}
	 */
	const prerun = [
		{
			output: `ITUnderground v${version} Mon Feb 20 22:00:06 CST 2023 SvelteKit

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent permitted by applicable law.
Last login: ${Date().slice(0, 24)} from 127.0.0.1`
		},
		{
			command: 'whoami',
			cwd: '/home/itunderground',
			server,
			user
		},
		{
			command: 'ls /home/itunderground',
			cwd,
			server,
			user
		},
		{
			command: 'cat underground',
			cwd,
			server,
			user
		}
	]; // Commands to be run before the user can interact with the shell
</script>

<Shell
	{prerun}
	animationSpeed={{
		characters: 0, //100,
		lines: 0 //500
	}}
/>
