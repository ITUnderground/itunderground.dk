import Command from '../command';
import { theme as themeStore } from '$lib/stores';
import type { ThemeName } from '../types';
import { themes } from '../const';

const isValidTheme = (theme: string): theme is ThemeName => {
	return Object.keys(themes).includes(theme);
};

export default new Command({
	command({ command: { positionalArguments } }) {
		const theme = positionalArguments[0];
		if (!theme) return `Available themes: ${Object.keys(themes).join(', ')}`;
		if (!isValidTheme(theme)) throw Error(`theme: theme '${theme}' not found`);

		themeStore.set({
			name: theme,
			custom: false
		});
		return `Theme set to ${theme}`;
	},
	description: 'Change your color scheme',
	namedArguments: []
});
