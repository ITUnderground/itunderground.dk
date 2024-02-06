---
title: 'FE CTF 2023 - The UniPwnie Experience Qualifiers - Writeups'
shortTitle: 'FE CTF 2023 - The UniPwnie Experience Qualifiers'
---

<script>
	import { page } from '$app/stores';
	import { ctfWriteups } from '$lib/dynamicFiles'

	const cwd = $page.url.pathname.split('/');
	const ctf = cwd[cwd.length - 1];
</script>

List of writups by ITUnderground for FE CTF 2023 - The UniPwnie Experience

<ul>

{#each Object.values(ctfWriteups()[ctf].writeups) as writeup}

<li><a href="{writeup.absPath}">{writeup.module.metadata.shortTitle || writeup.module.metadata.title}</a></li>

{/each}

</ul>
