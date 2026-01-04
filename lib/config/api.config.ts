const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const API_CONFIG = {
    baseUrl: API_BASE_URL,
    endpoints: {
        articles: '/api/articles',
        auth: {
            login: '/api/login',
            register: '/api/register',
            logout: '/api/logout',
            me: '/api/me',
        },
        users: '/api/users',
        tags: '/api/tags',
        schools: '/api/schools',
        cities: '/api/cities',
        status: '/api/status',
        roles: '/api/role',
    },
} as const;

export type ApiConfig = typeof API_CONFIG;
