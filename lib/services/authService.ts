import { API_CONFIG } from '../config/api.config';
import { apiClient } from '../api/apiClient';

const AUTH_ENDPOINT = API_CONFIG.endpoints.auth;

export interface LoginResponse {
    token: string;
    user: any; // Se podría tipar mejor con User interface
}

/**
 * Iniciar sesión
 */
export async function login(credentials: { email: string; password: string }): Promise<LoginResponse> {
    try {
        const data = await apiClient<LoginResponse>(AUTH_ENDPOINT.login, {
            method: 'POST',
            useAuth: false, // No necesitamos token para loguearnos
            body: JSON.stringify(credentials),
        });

        if (typeof window !== 'undefined') {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }

        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

/**
 * Cerrar sesión
 */
export function logout(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
}

/**
 * Obtener usuario actual (me)
 */
export async function getCurrentUser(): Promise<any> {
    try {
        return await apiClient(AUTH_ENDPOINT.me);
    } catch (error) {
        console.error('Error fetching current user:', error);
        throw error;
    }
}
