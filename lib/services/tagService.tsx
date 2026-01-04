import { Tag } from '../interfaces/tag.interface';
import { API_CONFIG } from '../config/api.config';

const API_URL = `${API_CONFIG.baseUrl + API_CONFIG.endpoints.tags}`;

//Obtener todos los tags
export async function getTags(): Promise<Tag[]> {
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

        return await response.json();
    } catch (error) {
        console.error('Error al obtener los artículos: ', error);
        throw error;
    }
}

// Obtener un tag específico por ID
export async function getTagById(id: number): Promise<Tag> {
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
        console.error('Error al obtener el tag: ', error);
        throw error;
    }
}
