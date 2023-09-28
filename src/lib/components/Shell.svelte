<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import CLI from '$lib/shell/cli';
	const cli = new CLI(reloadLog);

	/** @type {import('$lib/shell/types').LogEntry[]} */
	export let prerun = []; // Commands to be run before the user can interact with the shell

	export let animationSpeed = {
		characters: 0,
		lines: 0
	}; // Speed of the animation in ms. 0 for no animation
	let introAnimationPlaying = prerun.length === 0; // Both of these control whether the shell is interactive
	let interactive = true; // But this one allows commands to take control of the shell for a while

	let input = '';
	let input_right = '';
	$: log = [...cli.log];
	$: cwd = cli.dir.cwd.replace('/home/itunderground', '~');

	function reloadLog() {
		log = [...cli.log];
	}

	function submit() {
		input += input_right;
		input_right = '';
		interactive = false;
		cli.run(input).then(() => {
			log = [...cli.log];
			cwd = cli.dir.cwd.replace('/home/itunderground', '~');
			historyIndex = cli.history.length;
			interactive = true;
		});
		input = '';
	}

	// Navigate history
	let historyIndex = cli.history.length - 1;
	/** @type {(direction: string) => void} */
	function navigateHistory(direction) {
		if (direction === 'up') {
			if (historyIndex > 0) {
				historyIndex--;
				input = cli.history[historyIndex];
			}
		} else if (direction === 'down') {
			if (historyIndex < cli.history.length - 1) {
				historyIndex++;
				input = cli.history[historyIndex];
			} else {
				historyIndex = cli.history.length;
				input = '';
			}
		}
	}

	/**
	 * @param e {KeyboardEvent & { currentTarget: EventTarget & Window; }}
	 */
	async function onKeyDown(e) {
		// Skip animation when pressing enter
		if (e.key === 'Enter') {
			animationSpeed = {
				characters: 0,
				lines: 0
			};
			introAnimationPlaying = true;
		}
		if (!introAnimationPlaying || !interactive) return;
		// Navigate history
		if (e.key === 'ArrowUp') {
			navigateHistory('up');
		} else if (e.key === 'ArrowDown') {
			navigateHistory('down');
		}

		// Tab completion
		if (e.key === 'Tab') {
			e.preventDefault();
			const command = input + input_right;
			const [newCommand, completions] = cli.complete(command);
			if (completions.length === 1) {
				input = newCommand;
			} else if (completions.length > 1) {
				cli.newLine(command, completions.join(' '));
				reloadLog();
			}
		}

		// Navigate text left/right
		if (e.key === 'ArrowLeft') {
			input_right = input.slice(-1) + input_right;
			input = input.slice(0, -1);
		} else if (e.key === 'ArrowRight') {
			input = input + input_right.slice(0, 1);
			input_right = input_right.slice(1);
		}

		// Home/End
		if (e.key === 'Home') {
			input_right = input + input_right;
			input = '';
		} else if (e.key === 'End') {
			input = input + input_right;
			input_right = '';
		}

		// Add key to input
		if (e.key.length === 1 && !(e.ctrlKey || e.altKey || e.metaKey)) {
			input += e.key;
		}
		if (e.key === 'Backspace') {
			input = input.slice(0, -1);
		}
		if (e.key === 'Delete') {
			input_right = input_right.slice(1);
		}
		// Submit on enter
		if (e.key === 'Enter') {
			submit();
		}

		// Modifiers
		// CTRL+V
		if (e.ctrlKey && e.key === 'v') {
			e.preventDefault();
			navigator.clipboard.readText().then((text) => {
				input += text;
			});
		}
		// CTRL+backspace delete word
		if (e.ctrlKey && e.key === 'Backspace') {
			e.preventDefault();
			input = input.replace(/\s*\S+$/, '');
		}
	}

	// Run prerun commands
	async function type() {
		for (const logEntry of prerun) {
			if ('output' in logEntry) {
				// Print to stdout if there is output
				cli.stdout(logEntry.output);
			}
			if ('command' in logEntry) {
				// Run command if there is one
				// Display typing animation
				if (animationSpeed.characters === 0) {
					input = logEntry.command;
				} else {
					for (let i = 0; i < logEntry.command.length; i++) {
						await new Promise((resolve) => setTimeout(resolve, animationSpeed.characters));
						input = logEntry.command.slice(0, i + 1);
					}
				}
				// Run command
				await cli.run(logEntry.command);
				// Reset inpput
				input = '';
			}
			// Update log and cwd
			log = [...cli.log];
			cwd = cli.dir.cwd.replace('/home/itunderground', '~');
			// Update history index
			historyIndex = cli.history.length;
			// Wait for next line
			if (animationSpeed.lines !== 0)
				await new Promise((resolve) => setTimeout(resolve, animationSpeed.lines));
		}
		introAnimationPlaying = true;
	}

	type();

	// Force open mobile keyboard
	//! Removed because it was buggy
	/** @type {HTMLElement}*/
	// let mobileInput;
	// document.addEventListener('touchstart', () => {
	// 	// mobileInput.setAttribute('style', 'position:absolute;bottom:-100px;left:-100px;height:0px;');
	// 	mobileInput.focus();
	// });

	// Parse commands from query params
	$: (() => {
		const command = $page.url.searchParams.get('command');
		if (!command) return;
		// We do this because searchParams.delete does not work
		goto($page.url.search.replace(/(command=[^&]+)&?/, ''));
		cli.run(command).then(() => {
			log = [...cli.log];
			cwd = cli.dir.cwd.replace('/home/itunderground', '~');
			historyIndex = cli.history.length;
		});
	})();
</script>

<div class="flex w-full flex-col xl:w-[1280px]">
	<!-- Hidden input for mobile users -->
	<!--
	<input
		type="text"
		autocorrect="off"
		autocapitalize="none"
		bind:this={mobileInput}
		bind:value={input}
		class="absolute -bottom-8 -left-8 h-0"
	/>
	-->
	{#each log as line}
		{#if 'user' in line}
			<span>
				<span class="text-[var(--shellcolor-home)]"><strong>{line.user}@{line.server}</strong></span
				>:<span class="text-[var(--shellcolor-base)]"><strong>{line.cwd}</strong></span>$
				<span>{line.command}</span>
			</span>
		{/if}
		{#if 'output' in line && line.output !== ''}
			<span class="whitespace-pre-wrap break-keep">
				{@html line.output}
			</span>
		{/if}
	{/each}
	{#if interactive}
		<span>
			<span class="text-[var(--shellcolor-home)]"
				><strong>{cli.env.get('USER')}@{CLI.commands.hostname.fn(cli.dummyAccessObject)}</strong
				></span
			>:<span class="text-[var(--shellcolor-base)]"><strong>{cwd}</strong></span>$
			<span>{input}</span><span class="cursor" /><span
				class="-ml-[0.8rem] text-[var(--shellcolor-base)]">{input_right}</span
			>
		</span>
	{:else}
		<br />
	{/if}
</div>
<svelte:window on:keydown={onKeyDown} />

<style>
	/* monospace */
	* {
		font-family: inconsolata, monospace;
	}

	:global(body) {
		--purple: #dba9ff66;
		--shellcolor-home: #4beb53;
		--shellcolor-path: #d85aa5;
		--shellcolor-base: #c8c1b4;
	}
	.cursor {
		@apply inline-block h-[1.5rem] w-[0.8rem];
		@apply align-text-bottom;
		@apply bg-purple-500;
		animation: blink 1s infinite;
	}

	@keyframes blink {
		0% {
			background: transparent;
		}
		29% {
			background: transparent;
		}
		30% {
			background: var(--purple);
		}
		80% {
			background: var(--purple);
		}
		81% {
			background: transparent;
		}
		100% {
			background: transparent;
		}
	}
</style>
