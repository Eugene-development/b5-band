<script>
	// import { goto } from '$app/navigation';
	// import { auth } from '$lib/state/auth.svelte.js';
	import { publicSubmit } from '$lib/api/projects.js';

	// Simple redirect based on auth state
	// $effect(() => {
	// 	if (auth.isAuthenticated) {
	// 		console.log('✅ Home: User authenticated, redirecting to dashboard');
	// 		goto('/dashboard');
	// 	} else {
	// 		console.log('❌ Home: User not authenticated, redirecting to login');
	// 		goto('/login');
	// 	}
	// });

	// State and handler for ULID input (Secret Key)
	let secretKeyInput = $state('');
	let loading = $state(false);
	let successMessage = $state('');
	let errorMessage = $state('');

	function handleSecretKeyInput(event) {
		const rawValue = String(event.target.value || '');
		const upperSanitized = rawValue.toUpperCase().replace(/[^0-9A-HJKMNP-TV-Z]/g, ''); // Crockford Base32 without I, L, O, U
		secretKeyInput = upperSanitized.slice(0, 26);
	}

	async function handleSubmit(event) {
		event.preventDefault();
		successMessage = '';
		errorMessage = '';

		// Client-side ULID validation to avoid native pattern popups
		const ulidPattern = /^[0-9A-HJKMNP-TV-Z]{26}$/;
		if (!ulidPattern.test(secretKeyInput)) {
			errorMessage = 'Введите секретный ключ из 26 символов (ULID, латиница/цифры без I, L, O, U)';
			return;
		}

		loading = true;

		const form = event.currentTarget;
		const formData = new FormData(form);

		const payload = {
			secretKey: secretKeyInput,
			clientName: String(formData.get('client_name') || '').trim(),
			city: String(formData.get('city') || '').trim(),
			phone: String(formData.get('phone') || '').trim(),
			interest: String(formData.get('interest') || '').trim()
		};

		const result = await publicSubmit(payload);

		if (result.success) {
			successMessage = result.message || 'Данные успешно отправлены';
			form.reset();
			secretKeyInput = '';
		} else {
			errorMessage = result.message || 'Ошибка отправки данных';
		}

		loading = false;
	}
</script>

<!-- This page should not render anything as it immediately redirects -->

<div class="min-h-screen bg-gray-900 pb-24 pt-32 sm:pb-32 sm:pt-40">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<!-- <div class="mx-auto mb-16 text-center">
			<h1 class="text-pretty text-4xl font-normal tracking-widest text-white sm:text-6xl">
				Форма данных
			</h1>
			<p class="mt-6 text-lg/8 text-gray-300">Заполните форму ниже для обновления профиля</p>
		</div> -->

		<div
			class="relative z-10 mx-auto max-w-2xl overflow-hidden rounded-lg bg-gray-800 p-24 shadow-md before:absolute before:-z-10 before:h-24 before:w-24 before:rounded-full before:bg-purple-600 before:blur-2xl after:absolute after:-right-12 after:top-24 after:-z-10 after:h-32 after:w-32 after:rounded-full after:bg-sky-400 after:blur-xl"
		>
			<h2 class="mb-6 text-2xl font-bold text-white">Заполните данные</h2>

			{#if successMessage}
				<p class="mb-4 rounded-md bg-green-500/10 px-3 py-2 text-sm text-green-300">
					{successMessage}
				</p>
			{/if}
			{#if errorMessage}
				<p class="mb-4 rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-300">{errorMessage}</p>
			{/if}

			<form onsubmit={handleSubmit} novalidate>
				<div class="mb-4">
					<label class="block text-sm font-medium text-gray-300" for="secret_key"
						>Секретный ключ</label
					>
					<input
						class="mt-1 w-full rounded-md border border-gray-600 bg-gray-700 p-2 text-white"
						type="text"
						name="secret_key"
						id="secret_key"
						bind:value={secretKeyInput}
						oninput={handleSecretKeyInput}
						pattern="^[0-9A-HJKMNP-TV-Z]{26}$"
						minlength="26"
						maxlength="26"
						inputmode="latin"
						autocapitalize="characters"
						autocomplete="off"
						placeholder="01HZY8Y9G5F8M9B6W7K3NQ4Z8X"
					/>
				</div>

				<div class="mb-4">
					<label class="block text-sm font-medium text-gray-300" for="client_name"
						>Имя клиента</label
					>
					<input
						class="mt-1 w-full rounded-md border border-gray-600 bg-gray-700 p-2 text-white"
						type="text"
						name="client_name"
						id="client_name"
						placeholder="Введите имя клиента"
					/>
				</div>

				<div class="mb-4">
					<label class="block text-sm font-medium text-gray-300" for="city">Город</label>
					<input
						class="mt-1 w-full rounded-md border border-gray-600 bg-gray-700 p-2 text-white"
						type="text"
						name="city"
						id="city"
						placeholder="Укажите город"
					/>
				</div>

				<div class="mb-4">
					<label class="block text-sm font-medium text-gray-300" for="phone">Номер телефона</label>
					<input
						class="mt-1 w-full rounded-md border border-gray-600 bg-gray-700 p-2 text-white"
						type="tel"
						name="phone"
						id="phone"
						inputmode="tel"
						autocomplete="tel"
						placeholder="+7 (___) ___-__-__"
					/>
				</div>

				<div class="mb-6">
					<label class="block text-sm font-medium text-gray-300" for="interest"
						>Чем интересуется</label
					>
					<textarea
						class="mt-1 w-full rounded-md border border-gray-600 bg-gray-700 p-2 text-white"
						rows="3"
						name="interest"
						id="interest"
						placeholder="Опишите интерес клиента"
					></textarea>
				</div>

				<div class="flex justify-end">
					<button
						class="rounded-md bg-gradient-to-r from-purple-600 via-purple-400 to-blue-500 px-4 py-2 font-bold text-white hover:opacity-80 disabled:opacity-50"
						type="submit"
						disabled={loading}
					>
						{#if loading}Отправка...{/if}
						{#if !loading}Отправить{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
