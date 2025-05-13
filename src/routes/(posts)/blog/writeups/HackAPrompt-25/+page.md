---
title: 'HackAPrompt 2025 CTF - Writeups'
shortTitle: 'HackAPrompt 2025 CTF Writeups'
---

<script>
	import { page } from '$app/stores';
	import { ctfWriteups } from '$lib/dynamicFiles'

	const cwd = $page.url.pathname.split('/');
	const ctf = cwd[cwd.length - 1];
</script>

List of writups by ITUnderground for HackAPrompt 7 day CTF

<ul>

{#each Object.values(ctfWriteups()[ctf].writeups) as writeup}

<li><a href="{writeup.absPath}">{writeup.module.metadata.shortTitle || writeup.module.metadata.title}</a></li>

{/each}

</ul>
