<script>
	import '../app.css';
</script>

<div class="flex max-h-screen w-full flex-col-reverse items-center overflow-hidden" id="Terminal">
	<div class="w-full xl:w-[1280px]">
		<slot />
	</div>
</div>

<style>
	:global(body) {
		@apply bg-black text-[#c8c1b4];
	}
</style>
