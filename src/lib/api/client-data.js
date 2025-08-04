/**
 * Client Data API client
 * Provides functions for submitting client data
 */

import { API_CONFIG } from '$lib/config/api.js';
import { post, ApiError } from '$lib/api/client.js';

/**
 * Submit client data
 * @param {Object} clientData - Client data to submit
 * @param {string} clientData.clientName - Client name
 * @param {string} clientData.phone - Client phone
 * @param {string} clientData.product - Product name
 * @param {string} clientData.comment - Additional comment
 * @returns {Promise<any>}
 */
export async function submitClientData(clientData) {
	try {
		console.log('📤 submitClientData called with:', clientData);
		console.log('🌐 Using endpoint:', API_CONFIG.endpoints.submitClientData);

		const response = await post(
			API_CONFIG.endpoints.submitClientData,
			{
				client_name: clientData.clientName,
				phone: clientData.phone,
				product: clientData.product,
				comment: clientData.comment
			},
			{},
			true // Auth required
		);

		console.log('✅ submitClientData success:', response);

		return {
			success: response.success,
			message: response.message || 'Данные успешно отправлены'
		};
	} catch (error) {
		console.error('❌ submitClientData error:', error);

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
					message: 'Необходима авторизация'
				};
			}
		}

		return {
			success: false,
			message: 'Произошла ошибка при отправке данных'
		};
	}
}
