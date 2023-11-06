import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import type { Directory } from './shell/types';
import { version } from '$app/environment';
import { defaultDir } from './shell/const';

const dirDefault = defaultDir;

const dirInitial = (() => {
	if (!browser) return dirDefault;
	if (localStorage.getItem('dir')) {
		// Check if there has been an update
		const updatedVersion = localStorage.getItem('updatedVersion');
		if (updatedVersion !== version) {
			return Object.assign({}, JSON.parse(localStorage.getItem('dir')!), dirDefault); // Replaces anything that is on both old and new dir with new dir
		}
		// There hasn't been an update, we just load the previous dir
		return JSON.parse(localStorage.getItem('dir')!);
	}
	return dirDefault;
})();

const dir = writable<Directory>(dirInitial);

dir.subscribe((value) => {
	if (value === undefined) return;
	if (browser) {
		localStorage.setItem('dir', JSON.stringify(value));
		localStorage.setItem('updatedVersion', version);
	}
});

export { dir };
