<script>
	import Shell from '$lib/components/Shell.svelte';
	import { version } from '$app/environment';
	import { onMount } from 'svelte';

	export const prerender = true; // This page should be prerendered

	const cwd = '/home/itunderground';
	const server = 'itunderground';
	const user = 'itunderground';

	const padding = 5;

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
			command: 'whoami' + ' '.repeat(padding),
			cwd: '/home/itunderground',
			server,
			user
		},
		{
			command: 'ls /home/itunderground' + ' '.repeat(padding),
			cwd,
			server,
			user
		},
		{
			command: 'cat underground' + ' '.repeat(padding),
			cwd,
			server,
			user
		}
	]; // Commands to be run before the user can interact with the shell

	// Add cookie so we know the user has seen the animation
	let inBrowser = false;
	onMount(() => (inBrowser = true));
	function showAnimation() {
		if (!document.cookie.includes('seenAnimation')) {
			// Set cookie
            const age = 48 * 60 * 60; // 48 hours
			document.cookie = `seenAnimation=true; max-age=${age}`;
			return true;
		}
		return false;
	}
</script>

{#if inBrowser}
	<Shell
		{prerun}
		animationSpeed={{
			characters: showAnimation() ? 100 : 0,
			lines: showAnimation() ? 500 : 0
		}}
	/>
{/if}
