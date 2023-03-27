import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
    extensions: ['.svelte', '.md', '.svx'],
	preprocess: [
        vitePreprocess(),
        mdsvex({
            extensions: ['.md', '.svx'],
        }),
        preprocess({
            postcss: true,
        })
    ],
	kit: {
		adapter: adapter(),
        version: {
            name: process.env.npm_package_version
        }
	}
};

export default config;
