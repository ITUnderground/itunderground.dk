<script>
	const left = ['--\\-- itunderground', `<img src="nyan.png" alt="stylish">`];
	const right = ['(Emacs-Lisp Paredit lambda)', 'Git:master', '(87,0)'];
</script>

<footer class="fixed left-0 bottom-0 flex w-screen justify-between bg-[#3f355b] text-white">
	<div class="flex items-center gap-12">
		<!-- Left -->
		{#each left as item}
			<span>{@html item}</span>
		{/each}
	</div>
	<div class="flex flex-row-reverse gap-12">
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
