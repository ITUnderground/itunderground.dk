---
title: 'ITUnderground - Writeups'
---

<script>
	import { ctfWriteups } from '$lib/dynamicFiles'

</script>

List of writeups by ITUnderground

{#each Object.values(ctfWriteups()) as ctf}

    <blockquote>

    	## <a href="{ctf.absPath}">{ctf.module.metadata.shortTitle || ctf.module.metadata.title}</a>

    	<ul>
    		{#each Object.values(ctf.writeups) as writeup}
    			<li>
    				<a href="{writeup.absPath}">
    					{writeup.module.metadata.shortTitle || writeup.module.metadata.title}
    				</a>
    			</li>
    		{/each}
    	</ul>
    </blockquote>

{/each}
