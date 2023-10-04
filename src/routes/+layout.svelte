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
</style>
