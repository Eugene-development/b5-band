<script>
	/** @type {{ show: boolean, message: string }} */
	let { show = false, message = 'Загрузка...' } = $props();
</script>

{#if show}
	<div class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
		<div class="rounded-lg border border-white/10 bg-gray-900/90 p-8 text-center backdrop-blur-sm">
			<div class="mb-4">
				<div
					class="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white"
				></div>
			</div>
			<p class="font-medium text-white">{message}</p>
		</div>
	</div>
{/if}
