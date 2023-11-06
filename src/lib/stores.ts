import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import type { Directory } from './shell/types';

const dirDefault = undefined;

const dirInitial =
	browser && localStorage.getItem('dir') ? JSON.parse(localStorage.getItem('dir')!) : dirDefault;

const dir = writable<Directory>(dirInitial);

dir.subscribe((value) => {
	if (value === undefined) return;
	if (browser) {
		localStorage.setItem('dir', JSON.stringify(value));
	}
});

export { dir };
