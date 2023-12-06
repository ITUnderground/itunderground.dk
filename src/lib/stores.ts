import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import type { CustomTheme, Directory, ThemeName } from './shell/types';
import { version } from '$app/environment';
import { defaultDir } from './shell/const';

const dirDefault = defaultDir;
const historyDefault: string[] = [];

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
const historyInitial = browser
	? JSON.parse(localStorage.getItem('history') || 'null') ?? historyDefault
	: historyDefault;

const dir = writable<Directory>(dirInitial);
const history = writable<string[]>(historyInitial);

dir.subscribe((value) => {
	if (value === undefined) return;
	if (browser) {
		localStorage.setItem('dir', JSON.stringify(value));
		localStorage.setItem('updatedVersion', version);
	}
});
history.subscribe((value) => {
	if (value === undefined) return;
	// Limit to 100 entries
	if (value.length > 100) value = value.slice(value.length - 100);
	if (browser) {
		localStorage.setItem('history', JSON.stringify(value));
	}
});

const themeDefault = {
	name: 'papermod',
	custom: false
};
const themeInitial = browser
	? JSON.parse(localStorage.getItem('theme') || 'null') ?? themeDefault
	: themeDefault;
const theme = writable<{ name: ThemeName; custom: false | CustomTheme }>(themeInitial);
theme.subscribe((value) => {
	if (value === undefined) return;
	if (browser) {
		localStorage.setItem('theme', JSON.stringify(value));
	}
});

export { dir, history, theme };
