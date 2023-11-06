---
title: 'ITUnderground - Writeups'
---

<script>
	import { page } from '$app/stores';
	const writeupFiles = import.meta.glob('./*/*/*.md');
	const ctfFiles = import.meta.glob('./*/*.md');
	const cwd = $page.url.pathname;

	const ctfChallenges = {};
	for (const path in writeupFiles) {
		const pathElements = path.split('/'); // ['./', 'ctf', 'challenge', '+page.md']
		const ctf = pathElements[1];
		const challenge = pathElements[2];

		const challenges = ctfChallenges[ctf] || [];
		challenges.push(
			[
				pathElements.splice(1, 2).join('/'),
				writeupFiles[path]()
			] // the markdown module
		);
		ctfChallenges[ctf] = challenges;
	}

	const ctfModules = {};
	for (const path in ctfFiles) {
		const pathElements = path.split('/');
		const ctf = pathElements[1];

		ctfModules[ctf] = ctfFiles[path]();
	}


</script>

List of writeups by ITUnderground

{#each Object.keys(ctfChallenges) as ctf}

<blockquote>

{#await ctfModules[ctf] then ctfModule}

## <a href="{cwd}/{ctf}">{ctfModule.metadata.shortTitle || ctfModule.metadata.title}</a>

{/await}

<ul>

{#each ctfChallenges[ctf] as challenge}
{#await challenge[1] then challengeModule}

<li>
<a href="{cwd}/{challenge[0]}">
{challengeModule.metadata.shortTitle || challengeModule.metadata.title}
</a>
</li>

{/await}
{/each}

</ul>
</blockquote>

{/each}
