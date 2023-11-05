---
title: 'FE CTF 2023 The UniPwnie Experience - Writeups'
---

<script>
	import { page } from '$app/stores';
	const dirs = import.meta.glob('./*/*.md')
	const cwd = $page.url.pathname

	const filesPromise = Promise.all(Object.keys(dirs).map(async path => {
		return [
			path.slice(2).split('/')[0], // turn ./admin-cli/+page.md into admin-cli
			await dirs[path]() // fetch the markdown module
		];
	}))
</script>

List of writups by ITUnderground for FE CTF 2023 - The UniPwnie Experience

{#await filesPromise then files}

<ul>
{#each files as file}

<li><a href="{cwd}/{file[0]}">{file[1].metadata.shortTitle || file[1].metadata.title}</a></li>

{/each}

</ul>

{/await}
