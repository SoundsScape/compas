import { Article } from '../interfaces/article.interface';
import { API_CONFIG } from '../config/api.config';
import { apiClient } from '../api/apiClient';

const ENDPOINT = API_CONFIG.endpoints.articles;

/**
 * Obtener todos los artículos
 */
export async function getArticles(): Promise<Article[]> {
    try {
        const result = await apiClient<{ data: Article[] }>(ENDPOINT);
        return result.data || [];
    } catch (error) {
        console.error('Error al obtener los artículos: ', error);
        throw error;
    }
}

/**
 * Obtener un artículo específico por ID
 */
export async function getArticleById(id: number): Promise<Article> {
    try {
        return await apiClient<Article>(`${ENDPOINT}/${id}`);
    } catch (error) {
        console.error('Error al obtener el artículo: ', error);
        throw error;
    }
}
/**
 * Validar o rechazar un artículo
 */
export async function validateArticle(
    id: number,
    validated: boolean
): Promise<Article> {
    try {
        return await apiClient<Article>(`${ENDPOINT}/${id}/validate`, {
            method: 'PATCH',
            body: JSON.stringify({ validated }),
        });
    } catch (error) {
        console.error('Error al validar el artículo: ', error);
        throw error;
    }
}

/**
 * Eliminar un artículo
 */
export async function deleteArticle(id: number): Promise<{ message: string }> {
    try {
        return await apiClient<{ message: string }>(`${ENDPOINT}/${id}`, {
            method: 'DELETE',
        });
    } catch (error) {
        console.error('Error al eliminar el artículo: ', error);
        throw error;
    }
}
