'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/services/authService';
import LoginForm from '@/components/sections/login/LoginForm';
import { QuoteSection } from '@/components/sections/login/QuoteSection';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [_error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await login({ email, password });
            router.push('/home');
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión');
        }
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
