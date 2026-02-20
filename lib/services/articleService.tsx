import { Article } from '../interfaces/article.interface';
import { API_CONFIG } from '../config/api.config';

const API_URL = `${API_CONFIG.baseUrl + API_CONFIG.endpoints.articles}`;

//Obtener todos los artículos
export async function getArticles(): Promise<Article[]> {
    try {
        const token: string | null = localStorage.getItem('token');

        if (!token) {
            throw new Error('No hay token de autenticación');
        }

        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error('Error al obtener los artículos');

        const result = await response.json();
        const articles: Article[] = result.data || [];

        return articles;
    } catch (error) {
        console.error('Error al obtener los artículos: ', error);
        throw error;
    }
}

// Obtener un artículo específico por ID
export async function getArticleById(id: number): Promise<Article> {
    try {
        const token: string | null = localStorage.getItem('token');

        if (!token) {
            throw new Error('No hay token de autenticación');
        }

        const response = await fetch(`${API_URL}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error('Error al obtener el artículo');

        return await response.json();
    } catch (error) {
        console.error('Error al obtener el artículo: ', error);
        throw error;
    }
}
