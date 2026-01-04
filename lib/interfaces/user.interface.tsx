export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name?: string;
    recovery_token?: string;
    statuses_id?: number;
    roles_id?: number;
    image_path?: string;
    created_at?: string;
    updated_at?: string;
    role?: {
        id: number;
        role_name: string;
        description: string;
    };
    status?: {
        id: number;
        status_name: string;
        description: string;
    };
    school?: {
        id: number;
        name: string;
        address: string;
        contact_mail: string;
        contact_phone: string;
    };
}
