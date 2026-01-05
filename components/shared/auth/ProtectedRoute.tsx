'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Error403 } from '../error/403';
import { API_CONFIG } from '../../../lib/config/api.config';
interface ProtectedRouteProps {
    requiredRoles?: string[];
    children: React.ReactNode;
}

const ProtectedRoute = ({ requiredRoles, children }: ProtectedRouteProps) => {
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        const validateAccess = async () => {
            try {
                const res = await fetch(
                    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.me}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (res.status === 401 || res.status === 403) {
                    localStorage.removeItem('token');
                    setIsAuthorized(false);
                    return;
                }

                if (!res.ok) throw new Error('Failed to fetch user');

                const data = await res.json();
                localStorage.setItem('user', JSON.stringify(data.user));
                const userRole = data.user?.role?.role_name?.toLowerCase();

                if (!requiredRoles || requiredRoles.length === 0) {
                    setIsAuthorized(true);
                } else {
                    const hasRole = requiredRoles
                        .map(role => role.toLowerCase())
                        .includes(userRole);
                    setIsAuthorized(hasRole);
                }
            } catch (err) {
                console.error('Auth error:', err);
                setIsAuthorized(false);
            }
        };

        validateAccess();
    }, [requiredRoles, router]);

    if (isAuthorized === null) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-sky-200"></div>
            </div>
        );
    }

    if (isAuthorized === false) {
        return <Error403 />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
