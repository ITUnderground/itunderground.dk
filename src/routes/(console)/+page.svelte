<script>
	import Shell from '$lib/components/Shell.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { version } from '$app/environment';
	import { onMount } from 'svelte';

	const cwd = '/home/itunderground';
	const server = 'itunderground';
	const user = 'itunderground';

	const padding = 5;

	/**
	 * @type {import('$lib/shell/types').LogEntry[]}
	 */
	const prerun = [
		{
			output: `ITUnderground v${version} Mon Aug 28 16:48:20 CST 2023 SvelteKit

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent permitted by applicable law.
Last login: ${Date().slice(0, 24)} from 127.0.0.1`
		},
		// {
		// 	command: 'whoami' + ' '.repeat(padding),
		// 	cwd: '/home/itunderground',
		// 	server,
		// 	user
		// },
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

<div class="flex h-full w-full overflow-hidden" id="Terminal">
	<div class="flex w-full flex-col-reverse items-center justify-between">
		{#if inBrowser}
			<!-- This is pretty fucked, but basically I'm using a reverse flex column to that the terminal overflows on top, which means the footer needs to go first. -->
			<!-- If I didn't do this you would have to scroll down after every command which sucks -->
			<Footer />
			<Shell
				{prerun}
				animationSpeed={{
					characters: showAnimation() ? 75 : 0,
					lines: showAnimation() ? 500 : 0
				}}
			/>
		{/if}
	</div>
</div>
