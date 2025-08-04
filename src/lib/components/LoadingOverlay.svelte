<script>
	/** @type {{ show: boolean, message: string }} */
	let { show = false, message = 'Загрузка...' } = $props();
</script>

{#if show}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
		<div class="rounded-lg bg-white/10 p-8 text-center backdrop-blur-sm">
			<div class="mb-4">
				<div
					class="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white"
				></div>
			</div>
			<p class="text-white">{message}</p>
		</div>
	</div>
{/if}
