'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_CONFIG } from '@/lib/config/api.config';
import LoginForm from '@/components/sections/login/LoginForm';
import { QuoteSection } from '@/components/sections/login/QuoteSection';

export default function Login() {
    // Gestión de estado
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [_error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Llamada a la API de autenticación
        fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.login}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Invalid credentials');
                }
                return res.json();
            })
            .then(data => {
                // Almacenar datos de autenticación
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // Redirección basada en el rol del usuario
                // if (data.user.roles_id == 3 || data.user.roles_id == 4) {
                //     router.push('/dashboard');
                // } else if (data.user.roles_id == 2) {
                //     router.push('/home');
                // } else {
                router.push('/home');
                // }
            })
            .catch(err => {
                setError(err.message);
            });
    };

    return (
        <div className="flex h-full w-full flex-col overflow-hidden bg-[url(/fondo.png)] bg-cover bg-no-repeat md:flex-row">
            {/* Sección del formulario de inicio de sesión - Siempre visible */}
            <div className="relative order-1 flex min-h-screen w-full flex-col items-center shadow-lg md:min-h-screen md:w-2/5 md:border-none">
                <LoginForm
                    email={email}
                    password={password}
                    error={_error}
                    onEmailChange={setEmail}
                    onPasswordChange={setPassword}
                    onSubmit={handleSubmit}
                />
            </div>

            {/* Sección de citas - Solo visible en escritorio */}
            <div className="bg-background order-2 hidden min-h-[50vh] w-full items-center justify-center p-6 md:flex md:min-h-screen md:w-3/5 md:border-none md:p-10 lg:p-20">
                <QuoteSection />
            </div>
        </div>
    );
}
