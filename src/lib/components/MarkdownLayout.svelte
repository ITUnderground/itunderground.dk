<script>
	//! mdsvex does not support typescript yet, so we have to use jsdoc
	import { page } from '$app/stores';
	import '../styles/prism-one-dark.css';

	// Frontmatter props
	/** @type {string[]} */
	export let [title, date, length, author] = [];
	date = new Date(date).toLocaleDateString('dk-DK', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	$: breadcrumbs = $page.url.pathname
		.split('/')
		.slice(1)
		.map((p) => [p, p.charAt(0).toUpperCase() + p.slice(1).replace(/-/g, ' ')]);
	/**
	 * @param {unknown[]} a
	 * @param {number} i
	 */
	const last = (a, i) => i == a.length - 1;
	/**
	 * @param {string[][]} a
	 * @param {number} i
	 */
	const path = (a, i) =>
		a
			.map((p) => p[0])
			.slice(0, i + 1)
			.join('/');
</script>

<header class="m-auto flex h-16 max-w-5xl flex-wrap px-4 py-4">
	<a
		href="/"
		class="m-auto text-2xl font-bold text-[var(--primary)] no-underline hover:text-[var(--primary)]"
		>ITUnderground
		<img src="/cap.png" alt="itunderground" class="inline-block h-12" />
	</a>
</header>
<article class="m-auto min-h-[calc(100vh-4rem)] max-w-3xl p-4">
	<header class="my-6">
		<div class="flex flex-wrap text-sm text-[var(--secondary)]">
			{#each breadcrumbs as item, i}
				<a
					href="/{path(breadcrumbs, i)}"
					class="text-base text-[var(--primary)] no-underline hover:text-[var(--primary)]"
					>{item[1]}</a
				>
				{#if !last(breadcrumbs, i)}
					&nbsp;»&nbsp;
				{/if}
			{/each}
		</div>
		<h1 class="mb-[2px] text-4xl font-bold text-[var(--primary)]">{title}</h1>
		<div class="flex flex-wrap text-sm text-[var(--secondary)]">
			{date}&nbsp;·&nbsp;{length}&nbsp;·&nbsp;{author}
		</div>
	</header>
	<div class="post-content">
		<slot />
	</div>
</article>
