import { API_CONFIG } from '../config/api.config';
import { apiClient } from '../api/apiClient';

const STATUS_ENDPOINT = API_CONFIG.endpoints.status;

/**
 * Obtener todos los estatus
 */
export async function getStatuses(): Promise<any> {
    try {
        return await apiClient<any>(STATUS_ENDPOINT);
    } catch (error) {
        console.error('Error al obtener estatus: ', error);
        throw error;
    }
}