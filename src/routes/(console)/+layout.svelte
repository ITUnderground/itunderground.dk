<div class="console h-[100vh]">
	<slot />
</div>

<svelte:head>
	<title>ITUNDERGROUND</title>
</svelte:head>

<style lang="scss">
	.console {
		:global {
			@apply bg-[#1d1e20] text-[#c8c1b4];
			@apply text-2xl leading-7;
		}
	}
</style>
