<div class="console h-[calc(100vh-28px)]">
	<slot />
</div>

<style lang="scss">
	.console {
		:global {
			@apply bg-[#1d1e20] text-[#c8c1b4];
			@apply text-2xl leading-7;
		}
	}
</style>
