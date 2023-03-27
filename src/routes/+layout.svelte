<script>
	import '../app.css';
</script>

<slot />

<style>
	:global(body) {
		@apply bg-black text-[#c8c1b4];
        @apply text-2xl !leading-7;
	}
</style>