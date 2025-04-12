---
title: 'Will Hack For Drinks 2025 - Writeups'
shortTitle: 'Will Hack For Drinks 2025'
---

<script>
	import { page } from '$app/stores';
	import { ctfWriteups } from '$lib/dynamicFiles'

	const cwd = $page.url.pathname.split('/');
	const ctf = cwd[cwd.length - 1];
</script>

List of writups by ITUnderground for our Will Hack For Drinks 2025 event.

<ul>

{#each Object.values(ctfWriteups()[ctf].writeups) as writeup}

<li><a href="{writeup.absPath}">{writeup.module.metadata.shortTitle || writeup.module.metadata.title}</a></li>

{/each}

</ul>
