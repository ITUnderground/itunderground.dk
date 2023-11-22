<script context="module">
	import h1 from './markdownComponents/h1.svelte';
	import h2 from './markdownComponents/h2.svelte';
	import h3 from './markdownComponents/h3.svelte';
	import h4 from './markdownComponents/h4.svelte';
	import h5 from './markdownComponents/h5.svelte';
	import h6 from './markdownComponents/h6.svelte';

	// These are custom heading components.
	// Their only feature is turning the innerText into
	// their id as per the VSCode markdown intellisense.

	export { h1, h2, h3, h4, h5, h6 };
</script>

<script>
	//! mdsvex does not support typescript yet, so we have to use jsdoc
	import { page } from '$app/stores';
	import '../styles/prism-one-dark.css';

	// Frontmatter props
	/** @type {string|null[]} */
	export let [title, date, length, author, headline] = [];
	date = date
		? new Date(date).toLocaleDateString('dk-DK', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
		  })
		: null;

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

	const metaTitle = title + ' | ITUNDERGROUND' || 'ITUNDERGROUND';
	const metaUrl = 'https://itunderground.dk' + $page.url.pathname;
	const metaDescription = `${headline || 'Read post on ITUnderground.dk'}${
		author || date || length
			? ` - ${length ? `${length} read ` : ''}${author ? `by ${author}` : ''}${
					date ? ` - ${date}` : ''
			  }`
			: ''
	}`;
	const metaImage = 'https://itunderground.dk/header.png';
</script>

<svelte:head>
	{@html `<!-- Dynamic head meta -->
		<title>${metaTitle}</title>
		<meta name="title" content="${metaTitle}" />
		<meta name="description" content="${metaDescription}" />
		<meta property="og:title" content="${metaTitle}" />
		<meta property="og:url" content="${metaUrl}" />
		<meta property="og:description" content="${metaDescription}" />
		<meta property="og:image" content="${metaImage}" />
		<meta property="twitter:title" content="${metaTitle}" />
		<meta property="twitter:url" content="${metaUrl}" />
		<meta property="twitter:description" content="${metaDescription}" />
		<meta property="twitter:image" content="${metaImage}" />
		<meta property="twitter:card" content="summary_large_image" />`}
</svelte:head>

<header class="mx-0 my-auto flex h-16 w-full flex-wrap bg-[var(--background)] px-4 py-4">
	<a
		href="/"
		class="group m-auto text-2xl font-bold text-[var(--primary)] no-underline hover:text-[var(--brand)]"
		>ITUnderground
		<img src="/cap.png" alt="itunderground" class="ml-2 hidden h-12 group-hover:inline-block" />
		<img
			src="/cap-gray.png"
			alt="itunderground"
			class="ml-2 inline-block h-12 group-hover:hidden"
		/>
	</a>
</header>
<article class="m-auto min-h-[calc(100vh-4rem)] max-w-3xl p-4">
	<header class="my-6">
		<div class="flex flex-wrap text-sm text-[var(--secondary)]">
			{#each breadcrumbs as item, i}
				<a
					href="/{path(breadcrumbs, i)}"
					class="text-base text-[var(--primary)] no-underline hover:text-[var(--brand)]"
					>{item[1]}</a
				>
				{#if !last(breadcrumbs, i)}
					&nbsp;»&nbsp;
				{/if}
			{/each}
		</div>
		<h1 class="mb-[2px] text-4xl font-bold text-[var(--primary)]">{title}</h1>
		<div class="flex flex-wrap text-sm text-[var(--secondary)]">
			{#if date}
				<span>
					{date}
				</span>
			{/if}
			{#if date && (length || author)}
				<span> &nbsp;·&nbsp; </span>
			{/if}
			{#if length}
				<span>
					{length}
				</span>
			{/if}
			{#if length && author}
				<span> &nbsp;·&nbsp; </span>
			{/if}
			{#if author}
				<span>
					{author}
				</span>
			{/if}
		</div>
	</header>
	<div class="post-content">
		<slot />
	</div>
</article>
