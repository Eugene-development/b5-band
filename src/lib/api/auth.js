/**
 * Authentication API client for Laravel Sanctum Token Authentication
 * Provides authentication-specific methods and token management
 */

import { API_CONFIG, setAuthToken, removeAuthToken } from '$lib/config/api.js';
import { post, get, ApiError } from '$lib/api/client.js';

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {boolean} remember - Remember me option
 * @returns {Promise<any>}
 */
export async function loginUser(email, password, remember = false) {
	try {
		console.log('🔐 loginUser called with:', { email, password: '***', remember });
		console.log('🌐 Using endpoint:', API_CONFIG.endpoints.login);

		const response = await post(
			API_CONFIG.endpoints.login,
			{
				email,
				password,
				remember,
				device_name: 'web-browser'
			},
			{},
			false
		); // No auth required for login

		console.log('✅ loginUser success:', response);

		// Store the token if login was successful
		if (response.success && response.data?.token?.access_token) {
			console.log('🔑 Storing authentication token');
			setAuthToken(response.data.token.access_token);
		}

		return {
			success: response.success,
			user: response.data?.user,
			token: response.data?.token,
			message: response.message
		};
	} catch (error) {
		console.error('❌ loginUser error:', error);

		if (error instanceof ApiError) {
			console.log('📊 Error details:', { status: error.status, data: error.data });

			if (error.status === 422) {
				// Validation errors
				return {
					success: false,
					errors: error.data && error.data.errors ? error.data.errors : {},
					message: error.data && error.data.message ? error.data.message : 'Ошибка валидации'
				};
			} else if (error.status === 401) {
				return {
					success: false,
					message: 'Неверный email или пароль'
				};
			}
		}

		return {
			success: false,
			message: 'Произошла ошибка при входе'
		};
	}
}

/**
 * Logout current user
 * @returns {Promise<any>}
 */
export async function logoutUser() {
	try {
		const response = await post(API_CONFIG.endpoints.logout, {}, {}, true); // Auth required

		console.log('✅ Logout API response:', response);

		// Always remove token from storage
		console.log('🗑️ Removing authentication token');
		removeAuthToken();

		return {
			success: true,
			message: response.message || 'Вы успешно вышли из системы'
		};
	} catch (error) {
		// Even if logout request fails, consider it successful
		// since the main goal is to clear client state
		console.warn('Logout request failed:', error);
		console.log('🗑️ Force removing authentication token');
		removeAuthToken();

		return {
			success: true,
			message: 'Вы вышли из системы'
		};
	}
}

/**
 * Get current authenticated user data
 * @returns {Promise<{success: boolean, user?: any, message?: string}>}
 */
export async function getCurrentUser() {
	try {
		const response = await get(API_CONFIG.endpoints.user, {}, true); // Auth required

		return {
			success: response.success,
			user: response.data?.user || response.user
		};
	} catch (error) {
		if (error instanceof ApiError && error.status === 401) {
			// Token is invalid, remove it
			removeAuthToken();
			return {
				success: false,
				message: 'Пользователь не авторизован'
			};
		}

		return {
			success: false,
			message: 'Ошибка получения данных пользователя'
		};
	}
}

/**
 * Check if user is authenticated by trying to get user data
 * @returns {Promise<boolean>}
 */
export async function checkAuthentication() {
	try {
		const result = await getCurrentUser();
		return result.success;
	} catch {
		return false;
	}
}
