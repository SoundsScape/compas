import { Tag, CreateTag } from '../interfaces/tag.interface';
import { API_CONFIG } from '../config/api.config';
import { apiClient } from '../api/apiClient';

const ENDPOINT = API_CONFIG.endpoints.tags;

/**
 * Obtener todas las etiquetas
 */
export async function getTags(): Promise<Tag[]> {
    try {
        return await apiClient<Tag[]>(ENDPOINT);
    } catch (error) {
        console.error('Error al obtener etiquetas: ', error);
        throw error;
    }
}

/**
 * Obtener una etiqueta específica por ID
 */
export async function getTagById(id: number): Promise<Tag> {
    try {
        return await apiClient<Tag>(`${ENDPOINT}/${id}`);
    } catch (error) {
        console.error('Error al obtener la etiqueta: ', error);
        throw error;
    }
}

/**
 * Crear una etiqueta
 */
export async function postTag(body: CreateTag): Promise<Tag> {
    try {
        return await apiClient<Tag>(ENDPOINT, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    } catch (error) {
        console.error('Error al crear etiqueta: ', error);
        throw error;
    }
}

/**
 * Actualizar una etiqueta
 */
export async function updateTag(
    id: number,
    body: Partial<Tag>
): Promise<Tag> {
    try {
        return await apiClient<Tag>(`${ENDPOINT}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(body),
        });
    } catch (error) {
        console.error('Error al actualizar etiqueta: ', error);
        throw error;
    }
}

/**
 * Eliminar una etiqueta
 */
export async function deleteTag(id: number): Promise<{ message: string }> {
    try {
        return await apiClient<{ message: string }>(`${ENDPOINT}/${id}`, {
            method: 'DELETE',
        });
    } catch (error) {
        console.error('Error al eliminar etiqueta: ', error);
        throw error;
    }
}
