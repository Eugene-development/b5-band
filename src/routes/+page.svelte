<script>
	import { goto } from '$app/navigation';
	import { auth } from '$lib/state/auth.svelte.js';

	// Simple redirect based on auth state
	$effect(() => {
		if (auth.isAuthenticated) {
			console.log('✅ Home: User authenticated, redirecting to dashboard');
			goto('/dashboard');
		} else {
			console.log('❌ Home: User not authenticated, redirecting to login');
			goto('/login');
		}
	});
</script>

<!-- This page should not render anything as it immediately redirects -->
