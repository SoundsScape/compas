'use client';
import Image from 'next/image';

export function Error403() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-pink-100 text-center">
            <Image
                src="/403.png"
                className="w-1/4"
                alt=""
                width={400}
                height={300}
            />
            <p className="mt-4 font-mono text-3xl font-semibold text-black">
                403 - Acceso Denegado
            </p>
            <br></br>
            <p className="text-black">
                &quot;¡Oops! No tienes permiso para acceder a esta página.{' '}
                <br />
                No cuentas con los permisos necesarios para ver este
                contenido.&quot;
            </p>
            <button
                onClick={() => window.history.back()}
                className="mt-6 rounded-md bg-sky-200 px-6 py-2 text-black shadow-md transition-colors hover:bg-sky-300"
            >
                Volver atrás
            </button>
        </div>
    );
}
