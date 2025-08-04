<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { initializeAuth, auth } from '$lib/state/auth.svelte.js';
	import { goto } from '$app/navigation';

	/** @type {import('./$types').LayoutProps} */
	let { children } = $props();

	// Initialize auth on mount
	onMount(async () => {
		await initializeAuth();
	});

	// Check authentication on route changes
	$effect(() => {
		const currentPath = page.url.pathname;

		// If user is not authenticated and trying to access protected routes
		if (!auth.isAuthenticated && currentPath !== '/login' && currentPath !== '/') {
			goto('/login');
		}

		// If user is authenticated and on login page, redirect to dashboard
		if (auth.isAuthenticated && currentPath === '/login') {
			goto('/dashboard');
		}
	});
</script>

<div class="min-h-screen bg-gray-900">
	{@render children()}
</div>
