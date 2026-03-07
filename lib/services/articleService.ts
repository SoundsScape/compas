import { Article, PaginatedArticleResponse } from '../interfaces/article.interface';
import { API_CONFIG } from '../config/api.config';
import { apiClient } from '../api/apiClient';

const ENDPOINT = API_CONFIG.endpoints.articles;

/**
 * Obtener todos los artículos (sin paginación explícita para secciones generales)
 */
export async function getArticles(): Promise<Article[]> {
    try {
        // Pedimos un límite alto por defecto para asegurar que la Home tenga todos los puntos
        const url = `${ENDPOINT}?limit=1000`;
        const result = await apiClient<PaginatedArticleResponse>(url);
        return result.data || [];
    } catch (error) {
        console.error('Error al obtener los artículos: ', error);
        throw error;
    }
}

/**
 * Obtener artículos paginados para el Dashboard
 */
export async function getDashboardArticles(page: number = 1, limit: number = 10): Promise<PaginatedArticleResponse> {
    try {
        const url = `${ENDPOINT}?page=${page}&limit=${limit}`;
        return await apiClient<PaginatedArticleResponse>(url);
    } catch (error) {
        console.error('Error al obtener los artículos del dashboard (paginados): ', error);
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
/**
 * Crear un nuevo artículo
 */
export async function createArticle(formData: FormData): Promise<Article> {
    try {
        return await apiClient<Article>(ENDPOINT, {
            method: 'POST',
            body: formData,
        });
    } catch (error) {
        console.error('Error al crear el artículo: ', error);
        throw error;
    }
}
