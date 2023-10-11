<script lang="ts">
	import { formatId } from '$lib/markdown/helpers';

	let element: HTMLHeadingElement;
</script>

<h6 bind:this={element} id={formatId(element?.innerText)}>
	<slot />
</h6>
