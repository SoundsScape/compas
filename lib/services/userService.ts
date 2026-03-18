import { User } from '../interfaces/user.interface';
import { API_CONFIG } from '../config/api.config';
import { apiClient } from '../api/apiClient';

const USERS_ENDPOINT = API_CONFIG.endpoints.users;

/**
 * Obtener todos los usuarios
 */
export async function getUsers(): Promise<User[]> {
    try {
        return await apiClient<User[]>(USERS_ENDPOINT);
    } catch (error) {
        console.error('Error al obtener los usuarios: ', error);
        throw error;
    }
}

/**
 * Obtener un usuario por ID
 */
export async function getUserById(id: number): Promise<User> {
    try {
        return await apiClient<User>(`${USERS_ENDPOINT}/${id}`);
    } catch (error) {
        console.error('Error al obtener el usuario: ', error);
        throw error;
    }
}

/**
 * Crear un usuario
 */
export async function createUser(userData: Partial<User>): Promise<User> {
    try {
        return await apiClient<User>(USERS_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    } catch (err) {
        console.error('Error al crear usuario: ', err);
        throw err;
    }
}

/**
 * Actualizar usuario por ID
 */
export async function updateUser(
    id: number,
    userData: Partial<User>
): Promise<User> {
    try {
        return await apiClient<User>(`${USERS_ENDPOINT}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
    } catch (error) {
        console.error('Error al actualizar el usuario: ', error);
        throw error;
    }
}

/**
 * Eliminar usuario por ID
 */
export async function deleteUser(id: number): Promise<{ message: string }> {
    try {
        return await apiClient<{ message: string }>(`${USERS_ENDPOINT}/${id}`, {
            method: 'DELETE',
        });
    } catch (error) {
        console.error('Error al eliminar el usuario: ', error);
        throw error;
    }
}
