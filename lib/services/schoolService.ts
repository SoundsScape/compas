import { API_CONFIG } from '../config/api.config';
import { apiClient } from '../api/apiClient';

const SCHOOLS_ENDPOINT = API_CONFIG.endpoints.schools;

/**
 * Obtener todas las escuelas
 */
export async function getSchools(): Promise<any> {
    try {
        return await apiClient<any>(SCHOOLS_ENDPOINT);
    } catch (error) {
        console.error('Error al obtener escuelas: ', error);
        throw error;
    }
}
