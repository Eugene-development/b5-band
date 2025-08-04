<script>
	import { auth, logout } from '$lib/state/auth.svelte.js';
	import { submitClientData } from '$lib/api/client-data.js';
	import LoadingOverlay from '$lib/components/LoadingOverlay.svelte';

	// Form state using Svelte 5 runes
	let formData = $state({
		clientName: '',
		phone: '',
		product: '',
		comment: ''
	});

	// Form errors state
	let errors = $state({
		clientName: '',
		phone: '',
		product: '',
		comment: '',
		general: ''
	});

	// Loading state
	let isLoading = $state(false);

	// Success message
	let successMessage = $state('');

	/**
	 * Handle form submission
	 * @param {SubmitEvent} event
	 */
	async function handleSubmit(event) {
		event.preventDefault();

		// Reset errors and success message
		errors = {
			clientName: '',
			phone: '',
			product: '',
			comment: '',
			general: ''
		};
		successMessage = '';

		// Basic validation
		if (!formData.clientName.trim()) {
			errors.clientName = 'Имя клиента обязательно';
			return;
		}

		if (!formData.phone.trim()) {
			errors.phone = 'Телефон обязателен';
			return;
		}

		if (!formData.product.trim()) {
			errors.product = 'Изделие обязательно';
			return;
		}

		isLoading = true;

		try {
			console.log('📤 Submitting client data...');

			const result = await submitClientData(formData);

			if (result.success) {
				console.log('✅ Client data submitted successfully');
				successMessage = result.message || 'Данные успешно отправлены';

				// Reset form
				formData = {
					clientName: '',
					phone: '',
					product: '',
					comment: ''
				};
			} else {
				console.log('❌ Client data submission failed:', result);
				errors.general = result.message || 'Ошибка отправки данных';
			}
		} catch (error) {
			console.error('💥 Client data submission error:', error);
			errors.general = 'Произошла ошибка при отправке данных';
		} finally {
			isLoading = false;
		}
	}

	/**
	 * Handle logout
	 */
	async function handleLogout() {
		await logout();
	}
</script>

<div class="relative isolate min-h-screen bg-gray-900 py-24 sm:py-32">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mx-auto text-center">
			<h2 class="text-pretty text-4xl font-normal tracking-widest text-white sm:text-6xl">
				Отправка данных
			</h2>
			<p class="mt-6 text-lg/8 text-gray-300">Заполните форму для отправки данных клиента</p>
		</div>

		<div class="mx-auto mt-16 max-w-2xl">
			{#if errors.general}
				<div class="mb-6 rounded-md bg-red-500/10 p-4 text-red-400">
					{errors.general}
				</div>
			{/if}

			{#if successMessage}
				<div class="mb-6 rounded-md bg-green-500/10 p-4 text-green-400">
					{successMessage}
				</div>
			{/if}

			<form onsubmit={handleSubmit} class="space-y-8">
				<div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
					<div class="sm:col-span-2">
						<label for="clientName" class="block text-sm/6 font-semibold text-white"
							>Имя клиента *</label
						>
						<div class="mt-2.5">
							<input
								type="text"
								name="clientName"
								id="clientName"
								bind:value={formData.clientName}
								disabled={isLoading}
								class="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 disabled:opacity-50 {errors.clientName
									? 'outline-red-500'
									: ''}"
								placeholder="Введите имя клиента"
							/>
							{#if errors.clientName}
								<p class="mt-1 text-sm text-red-400">{errors.clientName}</p>
							{/if}
						</div>
					</div>

					<div class="sm:col-span-2">
						<label for="phone" class="block text-sm/6 font-semibold text-white">Телефон *</label>
						<div class="mt-2.5">
							<input
								type="tel"
								name="phone"
								id="phone"
								bind:value={formData.phone}
								disabled={isLoading}
								class="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 disabled:opacity-50 {errors.phone
									? 'outline-red-500'
									: ''}"
								placeholder="+7 (999) 123-45-67"
							/>
							{#if errors.phone}
								<p class="mt-1 text-sm text-red-400">{errors.phone}</p>
							{/if}
						</div>
					</div>

					<div class="sm:col-span-2">
						<label for="product" class="block text-sm/6 font-semibold text-white">Изделие *</label>
						<div class="mt-2.5">
							<input
								type="text"
								name="product"
								id="product"
								bind:value={formData.product}
								disabled={isLoading}
								class="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 disabled:opacity-50 {errors.product
									? 'outline-red-500'
									: ''}"
								placeholder="Укажите изделие"
							/>
							{#if errors.product}
								<p class="mt-1 text-sm text-red-400">{errors.product}</p>
							{/if}
						</div>
					</div>

					<div class="sm:col-span-2">
						<label for="comment" class="block text-sm/6 font-semibold text-white">Комментарий</label
						>
						<div class="mt-2.5">
							<textarea
								name="comment"
								id="comment"
								rows="4"
								bind:value={formData.comment}
								disabled={isLoading}
								class="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 disabled:opacity-50 {errors.comment
									? 'outline-red-500'
									: ''}"
								placeholder="Дополнительная информация..."
							></textarea>
							{#if errors.comment}
								<p class="mt-1 text-sm text-red-400">{errors.comment}</p>
							{/if}
						</div>
					</div>
				</div>

				<div class="mt-8 flex justify-between">
					<button
						type="button"
						onclick={handleLogout}
						disabled={isLoading}
						class="rounded-md bg-gray-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500 disabled:opacity-70"
					>
						Выйти
					</button>

					<button
						type="submit"
						disabled={isLoading}
						class="rounded-md bg-indigo-400 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-pink-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-70 disabled:hover:bg-indigo-400"
					>
						Отправить
					</button>
				</div>
			</form>
		</div>
	</div>
</div>

<!-- Loading Overlay -->
<LoadingOverlay show={isLoading} message="Отправляем данные..." />
