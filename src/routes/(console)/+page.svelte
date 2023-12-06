<script>
	import Shell from '$lib/components/Shell.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { onMount } from 'svelte';
	import { formatCtfWriteups } from '$lib/dynamicFiles';
	import { version } from '$app/environment';
	import { motd } from '$lib/shell/const';

	// Add cookie so we know the user has seen the animation
	let inBrowser = false;
	onMount(() => {
		inBrowser = true;
		addEventListener(
			'keydown',
			(e) => {
				if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.code) > -1) {
					e.preventDefault();
				}
			},
			false
		);
	});
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
		<!-- This is pretty fucked, but basically I'm using a reverse flex column so that the terminal overflows on top, which means the footer needs to go first. -->
		<!-- If I didn't do this you would have to scroll down after every command which sucks -->
		<Footer />
		{#if inBrowser}
			{@const showAnimationBool = showAnimation()}
			<Shell
				animationSpeed={{
					characters: showAnimationBool ? 75 : 0,
					lines: showAnimationBool ? 500 : 0
				}}
			/>
		{/if}
		<!-- Non-javascript buddies -->
		<noscript style="font-family: inconsolata, monospace;" class="max-w-full">
			<div class="flex w-full flex-col xl:w-[1280px]">
				<span class="whitespace-pre-wrap break-keep">
					{motd}
				</span>
				<span>
					<span class="text-[var(--shellcolor-home)]"><strong>it@underground</strong></span>:<span
						class="text-[var(--shellcolor-base)]"><strong>~</strong></span
					>$
					<span>ls /home/itunderground</span>
				</span>
				<span class="whitespace-pre-wrap break-keep">
					{@html 'flag.txt\n' +
						'<span style="color: #ec4899">secret_folder/</span>\n' +
						'underground\n' +
						'blog-posts\n' +
						'writeups'}
				</span>
				<span>
					<span class="text-[var(--shellcolor-home)]"><strong>it@underground</strong></span>:<span
						class="text-[var(--shellcolor-base)]"><strong>~</strong></span
					>$
					<span>cat underground</span>
				</span>
				<span class="whitespace-pre-wrap break-keep">
					{@html '├── <a href="/pages/who-are-we">who-are-we</a>\n' +
						'├── <a href="/pages/next-events">next-events</a>\n' +
						'├── <a href="/pages/discord">discord-server</a>\n' +
						'├── <a href="/pages/resources">resources</a>'}
				</span>
				<span>
					<span class="text-[var(--shellcolor-home)]"><strong>it@underground</strong></span>:<span
						class="text-[var(--shellcolor-base)]"><strong>~</strong></span
					>$
					<span>cat blog-posts</span>
				</span>
				<span class="whitespace-pre-wrap break-keep">
					{@html '└── <a href="/blog/setting-up-kali-windows">Setting up Kali Linux on Windows</a>'}
				</span>
				<span>
					<span class="text-[var(--shellcolor-home)]"><strong>it@underground</strong></span>:<span
						class="text-[var(--shellcolor-base)]"><strong>~</strong></span
					>$
					<span>cat writeups</span>
				</span>
				<span class="whitespace-pre-wrap break-keep">
					{@html formatCtfWriteups()}
				</span>
			</div>
		</noscript>
	</div>
</div>
