import { API_CONFIG } from '../config/api.config';
import { apiClient } from '../api/apiClient';

const ROLE_ENDPOINT = API_CONFIG.endpoints.roles;

/**
 * Obtener todos los roles
 */
export async function getRoles(): Promise<any> {
    try {
        return await apiClient<any>(ROLE_ENDPOINT);
    } catch (error) {
        console.error('Error al obtener roles: ', error);
        throw error;
    }
}