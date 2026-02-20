'use client';
import { useState, useEffect, useRef } from 'react';
import { Home, BookOpen, User, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { API_CONFIG } from '../../lib/config/api.config';

export function Navbar() {
    const router = useRouter();
    const cerrarSesion = () => {
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
                router.push('/login');
            })
            .catch(err => console.error(err));
    };
    const [modalAbierto, setModalAbierto] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const [username, setUsername] = useState<string | null>(null);

    const toggleModal = () => {
        setModalAbierto(!modalAbierto);
    };

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr && userStr !== undefined && userStr !== null) {
            try {
                const user = JSON.parse(userStr);
                setUsername(user.username);
            } catch (e) {
                console.error('Error parsing user from localStorage', e);
            }
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target as Node)
            ) {
                setModalAbierto(false);
            }
        };
        if (modalAbierto) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [modalAbierto]);

    return (
        <nav className="fixed top-0 right-0 left-0 z-50 text-white">
            <div className="from-primary via-primary/90 to-primary/20 relative mx-auto flex items-center justify-between bg-linear-to-b px-4 backdrop-blur-sm">
                <Link href="/home">
                    <Image
                        src="/logo.png"
                        alt="White Logo"
                        width={36}
                        height={36}
                        className="w-13 drop-shadow-[0px_0px_10px_rgba(0,0,0,0.9)] transition-all duration-500 hover:cursor-pointer hover:drop-shadow-[0px_0px_10px_rgba(255,255,255,0.9)]"
                    />
                </Link>
                <div className="flex h-16 grow items-center justify-center space-x-8">
                    <Link
                        href="/home"
                        className="flex items-center gap-2 transition-all duration-500 hover:drop-shadow-[0px_0px_10px_rgba(255,255,255,0.9)]"
                    >
                        <Home className="h-5 w-5" />
                        <span>Inicio</span>
                    </Link>
                    <Link
                        href="/articles"
                        className="flex items-center gap-2 transition-all duration-500 hover:drop-shadow-[0px_0px_10px_rgba(255,255,255,0.9)]"
                    >
                        <BookOpen className="h-5 w-5" />
                        <span>Artículos</span>
                    </Link>
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 transition-all duration-500 hover:drop-shadow-[0px_0px_10px_rgba(255,255,255,0.9)]"
                    >
                        <LayoutDashboard className="h-5 w-5" />
                        <span>Dashboard</span>
                    </Link>
                </div>
                <div className="ml-auto flex h-16 items-center justify-center space-x-8">
                    <button
                        onClick={toggleModal}
                        className="absolute w-10 cursor-pointer transition-all duration-500 hover:drop-shadow-[0px_0px_10px_rgba(255,255,255,0.9)]"
                    >
                        <User className="h-5 w-5" />
                    </button>
                    <div className="relative">
                        {modalAbierto && (
                            <motion.div
                                ref={modalRef}
                                initial={{ opacity: 0, y: -40 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="absolute top-20 right-5 w-48 rounded-sm text-white shadow-lg"
                            >
                                <div className="flex h-full w-full flex-col rounded-sm bg-black/90 p-4 backdrop-blur-sm">
                                    <p className="font-semibold">{username}</p>
                                    <Link
                                        className="cursor-pointer rounded px-2 py-2 hover:bg-black/60"
                                        href="/home/user-info/${username}"
                                    >
                                        Perfil
                                    </Link>
                                    <Link
                                        className="cursor-pointer rounded px-2 py-2 hover:bg-black/60"
                                        href="/home/configuracion"
                                    >
                                        Configuración
                                    </Link>
                                    <button
                                        className="cursor-pointer rounded px-2 py-2 text-left hover:bg-black/60"
                                        onClick={cerrarSesion}
                                    >
                                        Cerrar sesión
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
