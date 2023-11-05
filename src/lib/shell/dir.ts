import type Env from './env';
import { dir as dirStore, dirDefault } from '$lib/stores';
import type { Directory, File } from './types';
import { get } from 'svelte/store';
// Implements directory structure
class Dir {
	private _root: Directory = get(dirStore);
	private _cwd: string[];
	private _current = this._root;
	private _env: Env;
	constructor(env: Env) {
		this._cwd = ['home', 'itunderground'];
		this._navigate();
		this._env = env;
	}

	/**
	 * Navigates to current working directory
	 */
	_navigate() {
		this._current = this._locate(this._cwd) as typeof this._current;
	}
	/**
	 * Locates a directory in the file system. Returns null if directory doesn't exist.
	 * Note: Does not work with relative paths, or paths like `./`, `../` or `~/`. Use `getAbsolutePath` first to sanitize paths.
	 * @param path Absolute path to directory
	 * @returns Directory at path
	 */
	_locate(path: string[]): Directory | File | null {
		let current: Directory = this._root;

		// Navigate to actual directory
		for (const dir of path) {
			// Ignore if empty string
			if (dir === '') continue;
			// Break if this is not a directory
			if (typeof current !== 'object') break;
			// Return null if directory doesn't exist
			if (!(dir in current)) return null;
			// Navigate to next directory
			current = current[dir as keyof typeof current] as typeof current;
		}
		return current;
	}

	/**
	 * Recovers the file system from the default file system
	 */
	_recoverFilesystem() {
		this._root = dirDefault;
		this._cwd = ['home', 'itunderground'];
		this._navigate();
		dirStore.set(this._root);
	}

	/**
	 * List files in a directory. Defaults to current directory. If a file is specified, returns that file.
	 * @returns list of files in current directory
	 */
	dir(path?: string): string[] {
		// Return list of files
		const absPath = path ? this.getAbsolutePath(path) : this._cwd;
		const found = this._locate(absPath);
		if (typeof found === 'string') return [found];
		if (found === null) return [];
		if (typeof found === 'object')
			return Object.entries(found).map(([k, v]) => {
				if (typeof v === 'string') return k;
				return k + '/';
			});
		return [];
	}
	/**
	 * Gets/sets absolute path to current working directory
	 * @param path Path to set current working directory to
	 * @returns current working directory
	 */
	get cwd(): string {
		return '/' + this._cwd.join('/');
	}
	set cwd(path: string) {
		this._cwd = this.getAbsolutePath(path);
		this._navigate();
	}

	/**
	 * Get a file or directory. Returns null if file or directory doesn't exist.
	 * @param path Path to get
	 */
	read(
		path: string
	): { type: 'Directory'; value: Directory } | { type: 'File'; value: File } | null {
		// Get file
		const found = this._locate(this.getAbsolutePath(path));
		// Return file
		if (found === null) return null;
		if (typeof found === 'string') return { type: 'File', value: found };
		if (typeof found === 'object') return { type: 'Directory', value: found };
		return null;
	}

	/**
	 * Get absolute path to a file or directory
	 * @param path Path to get
	 */
	getAbsolutePath(path: string): string[] {
		path = path.replace('~', this._env.get('HOME') ?? '/');
		// Get path root dir
		const startingPath = path.startsWith('/') ? [] : this._cwd;
		const finalPath = [...startingPath];

		// Crawl path
		for (const dir of path.split('/')) {
			if (dir === '') continue;
			if (dir === '.') continue;
			if (dir === '..') {
				finalPath.pop();
				continue;
			}
			finalPath.push(dir);
		}
		// Return absolute path
		return finalPath.filter((p) => p !== '');
	}

	/**
	 * Write a file or directory to a path
	 * @param path The path to write to
	 * @param value The value to write. Can be a string or a directory
	 */
	write(path: string, value: Directory | string) {
		const absolutePath = this.getAbsolutePath(path);
		const dir = absolutePath.slice(0, -1);
		const file = absolutePath[absolutePath.length - 1];

		let current: Directory = this._root;
		for (const d of dir) {
			if (!(d in current)) current[d] = {};
			current = current[d] as Directory;
		}
		current[file] = value;
		dirStore.set(this._root);
	}

	/**
	 * Delete a file or directory
	 * @param path The path to delete
	 * @returns Whether the file was deleted
	 */
	rm(path: string) {
		const absolutePath = this.getAbsolutePath(path);

		// If / is passed, delete everything 🥚
		if (absolutePath.length === 0) {
			const terminal = document.getElementById('Terminal'); // we do a little trolling
			if (terminal) terminal.innerHTML = '';
			// Create full screen element with blue background and sad face
			const fullscreen = document.createElement('div');
			fullscreen.style.backgroundColor = '#0000FF';
			fullscreen.style.width = '100vw';
			fullscreen.style.height = '100vh';
			fullscreen.style.display = 'flex';
			fullscreen.style.justifyContent = 'center';
			fullscreen.style.alignItems = 'center';
			fullscreen.style.position = 'absolute';
			fullscreen.style.top = '0';
			fullscreen.style.left = '0';
			fullscreen.style.fontSize = '10rem';
			fullscreen.style.color = '#FFFFFF';
			fullscreen.innerHTML =
				':( <br><br> <p style="font-size: 2rem">&nbsp;&nbsp;&nbsp;file system gone</p>';
			document.body.appendChild(fullscreen);

			// Delete everything
			for (const key in this._root) delete this._root[key];
			dirStore.set(this._root);

			return true;
		}

		const [dir, file] = [absolutePath.slice(0, -1), absolutePath[absolutePath.length - 1]];

		let current: Directory = this._root;
		for (const d of dir) {
			if (!(d in current)) return false;
			current = current[d] as Directory;
		}
		if (!(file in current)) return false;

		// If cwd is in the path being deleted, move cwd to parent directory
		if (
			this._cwd.length >= absolutePath.length &&
			this._cwd.slice(0, absolutePath.length).join('/') === absolutePath.join('/')
		) {
			this._cwd = dir;
			this._navigate();
		}

		delete current[file];
		dirStore.set(this._root);
		return true;
	}
}

export default Dir;
