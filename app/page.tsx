'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import LogoutButton from '@/components/shared/LogoutBtn';
import { API_CONFIG } from '@/lib/config/api.config';
import { Button } from '@/components/ui/button';

export default function Landing() {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            router.push('/home');
        } else {
            setLoading(false);
        }
    }, [router]);

    const handleLogout = () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.logout}`, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + token,
            },
        })
            .then(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setToken(null);
            })
            .catch(err => console.error(err));
    };

    if (loading) return null; // o un loader

    return (
        <div className="relative min-h-screen bg-[url(/fondo.png)] bg-cover">
            <div className="from-background/50 to-background/10 flex min-h-screen bg-linear-to-br text-white">
                <Image
                    src="/logo.png"
                    alt="White Logo"
                    width={52}
                    height={52}
                    className="absolute top-4 right-4 w-16 rotate-y-180 drop-shadow-[0px_0px_10px_rgba(0,0,255,0.5)]"
                />
                <div className="absolute bottom-50 left-20 p-4">
                    <h1 className="my-4 text-7xl drop-shadow-[0px_0px_10px_rgba(255,255,255,0.5)]">
                        Compas
                    </h1>
                    <p className="my-4 text-xl drop-shadow-[0px_0px_10px_rgba(255,255,255,0.5)]">
                        «Aquellos que eran vistos bailando, eran considerados
                        locos por quienes no podían escuchar la música»
                    </p>

                    {!token ? (
                        <Link href="/login">
                            <Button
                                size="lg"
                                className="bg-accent hover:bg-accent/90 text-background mt-2 h-12 text-lg"
                            >
                                Iniciar sesión
                            </Button>
                        </Link>
                    ) : (
                        <LogoutButton onLogout={handleLogout} />
                    )}
                </div>
            </div>
        </div>
    );
}
