<script>
	import '../app.css';
</script>

<slot />

<style global>
	a {
		@apply text-[#9cbbc8] underline;
	}
	a:hover {
		@apply text-sky-500 no-underline;
	}

	/* Scrollbar styles */
	::-webkit-scrollbar {
		@apply h-2 w-2;
	}
	::-webkit-scrollbar-track {
		@apply bg-[#1d1e20];
	}
	::-webkit-scrollbar-thumb {
		@apply rounded-full bg-[#313235];
	}
</style>
