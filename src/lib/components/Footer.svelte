<script>
	const left = ['--\\-- itunderground', `<img src="nyan.png" alt="stylish">`];
	const right = ['(Emacs-Lisp Paredit lambda)', 'Git:master', '(87,0)'];
</script>

<footer class="bottom-0 left-0 flex h-7 w-screen justify-between bg-[#3f355b] text-white">
	<div class="flex items-center gap-12 overflow-hidden">
		<!-- Left -->
		{#each left as item}
			<span class="inline-block w-auto">{@html item}</span>
		{/each}
	</div>
	<div class="hidden flex-row-reverse gap-12 lg:flex">
		<!-- Right -->
		{#each right as item}
			<span>{@html item}</span>
		{/each}
	</div>
</footer>

<style>
	* {
		font-family: inconsolata, monospace;
	}
</style>
