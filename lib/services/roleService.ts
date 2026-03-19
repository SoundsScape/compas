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

/**
 * Crear un rol
 */
export async function createRole(data: { role_name: string, description: string }): Promise<any> {
    try {
        return await apiClient<any>(ROLE_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error al crear rol: ', error);
        throw error;
    }
}

/**
 * Actualizar un rol
 */
export async function updateRole(id: number, data: Partial<{ role_name: string, description: string }>): Promise<any> {
    try {
        return await apiClient<any>(`${ROLE_ENDPOINT}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error al actualizar rol: ', error);
        throw error;
    }
}

/**
 * Eliminar un rol
 */
export async function deleteRole(id: number): Promise<{ message: string }> {
    try {
        return await apiClient<{ message: string }>(`${ROLE_ENDPOINT}/${id}`, {
            method: 'DELETE'
        });
    } catch (error) {
        console.error('Error al eliminar rol: ', error);
        throw error;
    }
}