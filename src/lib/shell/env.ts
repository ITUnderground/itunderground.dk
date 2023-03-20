// For enviornment variables
class Env {
	private env: { [key: string]: string } = {};

	constructor(env: { [key: string]: string } = {}) {
		this.env = env;
	}

	public get = (key: string): string | null => {
		return this.env[key] ?? null;
	};
	public set = (key: string, value: string): void => {
		this.env[key] = value;
	};
	public delete = (key: string): void => {
		delete this.env[key];
	};
	public raw = (): string[] => {
		return Object.entries(this.env).map(([key, value]) => `${key}=${value}`);
	};
}

export default Env;
