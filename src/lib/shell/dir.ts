import type Env from './env';
import type { Directory, File } from './types';
// Implements directory structure
class Dir {
	private _root = {
		home: {
			itunderground: {
				'flag.txt': 'You\'ve been tricked! There isn\'t any flag here!',
				spooky_folder: {
					'inconspicuous.txt': 'You found me! Here\'s your flag: <code>itu{spooky}</code>',
				},
				underground: '├── <a href="/post/who-are-we">who-are-we</a>\n'
                           + '├── <a href="/post/next-events">next-events</a>\n'
                           + '├── <a href="/post/skill-level">im-a-beginner-help-me</a>\n'
                           + '├── <a href="/post/skill-level">im-ready-to-pwn</a>\n'
                           + '└── <a href="/post/discord">discord-server</a>'
			}
		}
	};
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
	 * List files in a directory. Defaults to current directory. If a file is specified, returns that file.
	 * @returns list of files in current directory
	 */
	dir(path?: string): string[] {
		// Return list of files
		const dir = path ? this.getAbsolutePath(path) : this._cwd;
		const found = this._locate(dir);
		if (typeof found === 'string') return [found];
		if (found === null) return [];
		if (typeof found === 'object') return Object.keys(found);
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
	read(path: string): { type: "Directory", value: Directory } | { type: "File", value: File } | null {
		// Get file
		const found = this._locate(this.getAbsolutePath(path));

		// Return file
        if (!found) return null;
		if (typeof found === 'string') return { type: 'File', value: found };
		if (typeof found === 'object') return { type: 'Directory', value: found };
		return null;
	}

	/**
	 * Get absolute path to a file or directory
	 * @param path Path to get
	 */
	getAbsolutePath(path: string): string[] {
		// Get starting path
		const startingPath = path.startsWith('/')
			? []
			: path.startsWith('~')
			? this._env.get('HOME')?.split('/') ?? []
			: this._cwd;
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
    }
}

export default Dir;