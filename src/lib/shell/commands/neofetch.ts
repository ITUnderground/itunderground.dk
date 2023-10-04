import CLI from '../cli';
import Command from '../command';

type Brand = {
	brand: string;
	version: string;
};

export default new Command({
	async command(accessObject) {
		if (!accessObject) return;
		const { cli, env, js } = accessObject;

		const user = env.get('USER') || 'it';
		const hostname = CLI.commands.hostname.fn(accessObject);
		const loc = `${user}@${hostname}`;
		const os = js(`navigator.userAgentData?.platform`);
		const browser = (js(`navigator.userAgentData?.brands`) as Brand[] | undefined)
			?.map((brand) => brand.brand)
			.join(', ');
		const uptime = new Date(Date.now() - parseInt(env.get('START_TIME')!))
			.toISOString()
			.slice(11, -5);
		const packages = Object.keys(CLI.commands).length;
		const shell = 'ColorShell';
		const terminal = 'Web Terminal';
		const CPU = (js(`window.navigator.hardwareConcurrency`) || 'unknown') + ' cores';
		const GPU = (
			js(
				`(() => {
				var canvas = document.createElement('canvas');
				var gl = canvas.getContext("experimental-webgl");
				
				var dbgRenderInfo = gl.getExtension("WEBGL_debug_renderer_info");
				return gl.getParameter(dbgRenderInfo.UNMASKED_RENDERER_WEBGL);
			})();`
			) as string | undefined
		)
			?.split('Direct')[0]
			.split(',')[1]
			.trim();
		const memory = js(`navigator.deviceMemory`) + 'GB';

		const logo = [
			'<span style="color: white;">               .~?5GP5PGBB#&GYJ7:       </span>',
			'<span style="color: white;">             ^YP#@#BB&@@@@@@@@#G#BJ^    </span>',
			'<span style="color: white;">            Y@@@@GB@@@@@B5&@@@@&G@@@5.  </span>',
			'<span style="color: white;">           7@@@&P#@@@@@@@@@@@@@@#B@@G#Y:</span>',
			'<span style="color: white;">          .#@@&P&@@@@@@@@@@@@@@@&G@@@@@P</span>',
			'<span style="color: white;">          5@@&5&@@@@@@@@@@@@@@@@&G@@@@@&</span>',
			'<span style="color: white;">         !@@@G#@@@@@@@@@@@@@@@@@GB@@@@@&</span>',
			'<span style="color: white;">        :P&&#G@@@@@@@@@@@@@@@@@@5@@@@@@#</span>',
			'<span style="color: white;">      ^Y&#BBGG####&&&@@@@@@@@@@BB@@@@@@5</span>',
			'<span style="color: white;">    ~P@@@@@@@@@@&&##BBBB#######Y&&&&##B^</span>',
			'<span style="color: white;"> :?B@@@@@@@&#BB##BBBB&&#&@&&&&&#?.....  </span>',
			'<span style="color: white;">J&@@@@@@&BBBBGPPPPPGGGGGB#&@@@G~        </span>',
			'<span style="color: white;">:!JP#@@@&BBGGGGGGGPGPPGB#&@@B!          </span>',
			'<span style="color: white;">    .^75B&&&##BBBBBBB#&@@&G7            </span>',
			'<span style="color: white;">         :~?5G#&&@@&#BPY7^              </span>'
		];

		const output = [
			`${logo[0]}   <span style="color: #4beb53;">${loc}</span>\n`,
			`${logo[1]}   ${'-'.repeat(loc.length)}\n`,
			`${logo[2]}   <span style="color: #4beb53;">OS:</span> ${os}\n`,
			`${logo[3]}   <span style="color: #4beb53;">Browser:</span> ${browser}\n`,
			`${logo[4]}   <span style="color: #4beb53;">Uptime:</span> ${uptime}\n`,
			`${logo[5]}   <span style="color: #4beb53;">Packages:</span> ${packages}\n`,
			`${logo[6]}   <span style="color: #4beb53;">Shell:</span> ${shell}\n`,
			`${logo[7]}   <span style="color: #4beb53;">Terminal:</span> ${terminal}\n`,
			`${logo[8]}   <span style="color: #4beb53;">CPU:</span> ${CPU}\n`,
			`${logo[9]}   <span style="color: #4beb53;">GPU:</span> ${GPU}\n`,
			`${logo[10]}   <span style="color: #4beb53;">Web memory:</span> ${memory}\n`,
			`${logo[11]}   <span style="color: #dba9ff66;">▮</span>` +
				'<span style="color: #4beb53;">▮</span>' +
				'<span style="color: #d85aa5;">▮</span>' +
				'<span style="color: #c8c1b4;">▮</span>' +
				'<span style="color: #3f355b;">▮</span>' +
				'<span style="color: #fdb2dd;">▮</span>' +
				'<span style="color: #e2eaf3;">▮</span>\n',
			...logo.slice(12).map((line) => `${line}`)
		];

		await new Promise((resolve) => setTimeout(resolve, 300));
		for (const line of output) {
			cli.stdout(line);
			await new Promise((resolve) => setTimeout(resolve, 10));
		}
	},
	description: 'Neofetch - A fast, highly customizable system info script',
	namedArguments: []
});
