<script>
	import { onMount } from 'svelte';

	// Redirect to / without adding to history
	// This page only exists for the breadcrumbs
	onMount(() => window.location.replace('/?command=cat%20blog-posts'));
</script>
