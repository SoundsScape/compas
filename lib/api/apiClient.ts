import { API_CONFIG } from '../config/api.config';

/**
 * Interface para las opciones de petición personalizadas
 */
interface FetchOptions extends RequestInit {
    useAuth?: boolean;
}

/**
 * Cliente API centralizado para manejar peticiones, tokens y errores.
 */
export async function apiClient<T>(
    endpoint: string,
    { useAuth = true, headers, ...options }: FetchOptions = {}
): Promise<T> {
    const url = `${API_CONFIG.baseUrl}${endpoint}`;

    const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    };

    if (useAuth) {
        // Solo intentamos acceder a localStorage si estamos en el cliente
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                defaultHeaders['Authorization'] = `Bearer ${token}`;
            }
        }
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...headers,
            },
        });

        if (!response.ok) {
            // Manejo básico de errores de auth (e.g. 401)
            if (response.status === 401 && typeof window !== 'undefined') {
                localStorage.removeItem('token');
                // Podríamos redirigir al login aquí si fuera necesario
            }
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Fetch error for ${url}:`, error);
        throw error;
    }
}
