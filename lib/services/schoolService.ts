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

/**
 * Crear una nueva escuela
 */
export async function createSchool(data: { name: string, address: string, contact_mail: string, contact_phone: string }): Promise<any> {
    try {
        return await apiClient<any>(SCHOOLS_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error al crear la escuela: ', error);
        throw error;
    }
}

/**
 * Actualizar una escuela existente
 */
export async function updateSchool(id: number, data: Partial<{ name: string, address: string, contact_mail: string, contact_phone: string }>): Promise<any> {
    try {
        return await apiClient<any>(`${SCHOOLS_ENDPOINT}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error al actualizar la escuela: ', error);
        throw error;
    }
}

/**
 * Eliminar una escuela
 */
export async function deleteSchool(id: number): Promise<{ message: string }> {
    try {
        return await apiClient<{ message: string }>(`${SCHOOLS_ENDPOINT}/${id}`, {
            method: 'DELETE'
        });
    } catch (error) {
        console.error('Error al eliminar la escuela: ', error);
        throw error;
    }
}
