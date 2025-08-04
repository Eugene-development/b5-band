<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { initializeAuth, auth } from '$lib/state/auth.svelte.js';
	import { goto } from '$app/navigation';

	/** @type {import('./$types').LayoutProps} */
	let { children } = $props();

	let isInitializing = $state(true);

	// Initialize auth on mount
	onMount(async () => {
		console.log('🚀 Layout: Initializing auth...');
		await initializeAuth();
		console.log('✅ Layout: Auth initialized');
		isInitializing = false;
	});

	// Check authentication on route changes and auth state changes
	$effect(() => {
		if (isInitializing) return; // Don't redirect during initialization

		const currentPath = page.url.pathname;
		console.log(
			'🔄 Layout: Route or auth state change detected:',
			currentPath,
			'Auth state:',
			auth.isAuthenticated
		);

		// If user is not authenticated and trying to access protected routes
		if (!auth.isAuthenticated && currentPath !== '/login' && currentPath !== '/') {
			console.log('❌ Layout: User not authenticated, redirecting to login');
			goto('/login');
		}

		// If user is authenticated and on login page, redirect to dashboard
		if (auth.isAuthenticated && currentPath === '/login') {
			console.log('✅ Layout: User authenticated, redirecting to dashboard');
			// Add small delay to ensure state is fully updated
			setTimeout(() => {
				goto('/dashboard');
			}, 100);
		}
	});
</script>

{#if isInitializing}
	<div class="flex min-h-screen items-center justify-center bg-gray-900">
		<div class="text-center">
			<div
				class="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white"
			></div>
			<p class="mt-4 text-white">Инициализация приложения...</p>
		</div>
	</div>
{:else}
	<div class="min-h-screen bg-gray-900">
		{@render children()}
	</div>
{/if}
