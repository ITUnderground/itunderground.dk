import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex';
import preprocess from 'svelte-preprocess';
import remarkMath from 'remark-math';
import rehypeKatexSvelte from 'rehype-katex-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	extensions: ['.svelte', '.md', '.svx'],
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.md', '.svx'],
			smartypants: true,
			layout: './src/lib/components/MarkdownLayout.svelte',
			remarkPlugins: [remarkMath],
			rehypePlugins: [rehypeKatexSvelte]
		}),
		preprocess({
			postcss: true
		})
	],
	kit: {
		adapter: adapter(),
		version: {
			name: process.env.npm_package_version
		},
		prerender: {
			// IDs are generated client-side.
			// couldn't figure out how to do it on build so ignore error it is
			handleMissingId: 'ignore'
		}
	}
};

export default config;
