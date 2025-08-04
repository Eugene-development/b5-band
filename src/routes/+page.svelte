<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/state/auth.svelte.js';

	onMount(() => {
		// Redirect based on authentication status
		if (auth.isAuthenticated) {
			goto('/dashboard');
		} else {
			goto('/login');
		}
	});
</script>

<div class="flex min-h-screen items-center justify-center">
	<div class="text-center">
		<div
			class="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white"
		></div>
		<p class="mt-4 text-white">Загрузка...</p>
	</div>
</div>
