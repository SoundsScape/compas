'use client';

import { Button } from '@/components/ui/button';
import React from 'react';

interface LoginFormProps {
    email: string;
    password: string;
    error: string;
    onEmailChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    isLoading?: boolean;
}

export const LoginForm = ({
    email,
    password,
    error,
    onEmailChange,
    onPasswordChange,
    onSubmit,
    isLoading = false,
}: LoginFormProps) => (
    <div className="bg-background/30 relative flex h-full w-full flex-col items-center justify-center overflow-hidden px-4 py-8 backdrop-blur-sm md:py-0">
        <h1 className="z-10 mb-9 text-center text-2xl font-semibold text-white drop-shadow-md md:text-5xl">
            Bienvenido!
        </h1>

        {error && (
            <div className="mb-4 w-full max-w-sm rounded bg-red-100/10 px-3 py-2">
                <p className="text-center text-red-500">{error}</p>
            </div>
        )}

        <form
            onSubmit={onSubmit}
            className="relative z-10 w-full max-w-sm space-y-5 px-4"
        >
            <div className="flex flex-col gap-2">
                <label htmlFor="email" className="font-semibold drop-shadow-sm">
                    Correo Electrónico
                </label>
                <input
                    value={email}
                    onChange={e => onEmailChange(e.target.value)}
                    type="email"
                    id="email"
                    placeholder="tu@correo.com"
                    className="w-full rounded-md bg-white p-3 text-black shadow-md transition-all duration-300 focus:ring-2 focus:ring-sky-100 focus:outline-none"
                    required
                    disabled={isLoading}
                    aria-required="true"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label
                    htmlFor="password"
                    className="font-semibold text-white drop-shadow-sm"
                >
                    Contraseña
                </label>
                <input
                    value={password}
                    onChange={e => onPasswordChange(e.target.value)}
                    type="password"
                    id="password"
                    placeholder="Tu contraseña"
                    className="h-12 w-full rounded-md bg-white p-3 text-black shadow-md transition-all duration-300 focus:ring-2 focus:ring-sky-100 focus:outline-none"
                    required
                    disabled={isLoading}
                    aria-required="true"
                />
            </div>

            <Button
                type="submit"
                disabled={isLoading}
                className="bg-accent hover:bg-accent/90 mt-2 h-12 w-full text-lg font-semibold text-black transition-all duration-300 ease-in-out hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isLoading ? 'Cargando...' : 'Iniciar sesión'}
            </Button>
        </form>
    </div>
);

export default LoginForm;
