"use client"
import Image from 'next/image'

export function Error403() {
  return (
    <div className="min-h-screen bg-pink-100 flex flex-col text-center items-center justify-center">
      <Image src="/403.png" className="w-1/4" alt="" width={400} height={300} />
      <p className="mt-4 font-mono text-3xl font-semibold text-black">
        403 - Acceso Denegado
      </p>
      <br></br>
      <p className="text-black">
        &quot;¡Oops! No tienes permiso para acceder a esta página. <br />
        No cuentas con los permisos necesarios para ver este contenido.&quot;
      </p>
      <button
        onClick={() => window.history.back()}
        className="mt-6 px-6 py-2 bg-sky-200 text-black rounded-md shadow-md hover:bg-sky-300 transition-colors"
      >
        Volver atrás
      </button>
    </div>
  );
}
