<script>
	import '../../app.css';
</script>

<div class="outer">
	<div class="inner">
		<main>
			<div class="buttons">
				<span class="bg-gray-700">
					<!-- minimise and maximise aren't visible, but I'll still keep them in case they become useful -->
					<svg
						class="hidden"
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="3"
						stroke-linecap="round"
						stroke-linejoin="round"><line x1="5" y1="18" x2="19" y2="18" /></svg
					></span
				>
				<span class="bg-gray-700"
					><svg
						class="hidden"
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="3"
						stroke-linecap="round"
						stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2" /></svg
					></span
				>
				<!-- "is not a valid href attribute" dies of cringe -->
				<!-- svelte-ignore a11y-invalid-attribute -->
				<a
					href="javascript:history.back()"
					class="bg-blue-600 text-black hover:cursor-pointer hover:text-white"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="3"
						stroke-linecap="round"
						stroke-linejoin="round"
						><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg
					>
				</a>
			</div>
			<slot />
		</main>
	</div>
</div>

<style>
	.outer {
		@apply h-screen w-screen;
	}
	.outer::before {
		/* CRT effect */
		@apply pointer-events-none absolute bottom-0 left-0 right-0 top-0 block content-[""];
		background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
			linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
		background-size:
			100% 4px,
			6px 100%;
	}
	.inner {
		@apply h-full w-full bg-indigo-900;
		@apply flex items-center justify-center;
	}
	main {
		@apply relative z-10 max-h-[90%] min-h-[80%] min-w-[80%] max-w-[90%] rounded-lg bg-slate-900 p-10;
	}
	.buttons {
		@apply absolute right-2 top-2 flex space-x-1;
		font-size: 0;
	}
	.buttons > * {
		@apply flex h-6 max-h-[1.5rem] w-6 max-w-[1.5rem] rounded-full;
	}
	.buttons > * > svg {
		@apply m-auto h-4 max-h-[1rem] w-4 max-w-[1rem];
	}
	.buttons > span:hover {
		@apply text-base;
	}

	/* Other */
	:global(h1) {
		@apply mb-5 text-5xl;
	}
	:global(h2) {
		@apply mb-5 text-4xl;
	}
	:global(h3) {
		@apply mb-5 text-3xl;
	}
	:global(h4) {
		@apply mb-5 text-2xl;
	}
	:global(h5) {
		@apply mb-5 text-xl;
	}
	:global(h6) {
		@apply mb-5 text-lg;
	}
	:global(p) {
		@apply text-base;
	}
</style>
