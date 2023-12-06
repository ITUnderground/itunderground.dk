<script>
	import '../app.css';
	import { theme } from '$lib/stores';
	import { themes } from '$lib/shell/const';

	const basethemecss = Object.entries(themes.papermod).reduce(
		(acc, [key, value]) => `${acc}\n --${key}: ${value};`,
		'\n/* Base theme: papermod */'
	);
	let cssVars = basethemecss;
	$: cssVars = Object.entries(themes[$theme.name]).reduce(
		(acc, [key, value]) => `${acc}\n --${key}: ${value} !important;`,
		'/* Custom theme: ' + $theme.name + ' */'
	);
</script>

<div style={cssVars + '\n' + basethemecss}>
	<slot />
</div>

<style global>
	a {
		@apply text-[#9cbbc8] underline;
	}
	a:hover {
		@apply text-sky-500 no-underline;
	}

	/* Scrollbar styles */
	::-webkit-scrollbar {
		@apply h-2 w-2;
	}
	::-webkit-scrollbar-track {
		@apply bg-[#1d1e20];
	}
	::-webkit-scrollbar-thumb {
		@apply rounded-full bg-[#313235];
	}
</style>
