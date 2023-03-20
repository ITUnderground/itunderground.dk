<script>
	import '../../app.css';
</script>

<a href="/">&#60;Back</a>
<slot />

<style>
	:global(h1) {
		@apply mb-5 text-5xl;
	}
	:global(h2) {
		@apply mb-5 text-4xl;
	}
	:global(h3) {
		@apply mb-5 text-3xl;
	}
	:global(h4) {
		@apply mb-5 text-2xl;
	}
	:global(h5) {
		@apply mb-5 text-xl;
	}
	:global(h6) {
		@apply mb-5 text-lg;
	}
	:global(p) {
		@apply text-base;
	}
</style>
