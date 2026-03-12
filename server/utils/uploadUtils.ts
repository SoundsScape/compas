import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

/**
 * Guarda un archivo en el disco local y devuelve su ruta relativa.
 * @param file El archivo binario de la petición (File)
 * @param subDir Subdirectorio dentro de public/storage (ej: 'articles')
 * @returns La ruta relativa para guardar en la base de datos (ej: '/storage/articles/foto.jpg')
 */
export async function saveFileLocally(file: File, subDir: string = 'articles'): Promise<string> {
    try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Definir rutas
        const uploadDir = join(process.cwd(), 'public', 'storage', subDir);

        // Asegurar que el directorio existe
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // Crear nombre de archivo único
        const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        const filePath = join(uploadDir, uniqueName);

        // Guardar archivo
        await writeFile(filePath, buffer);

        return `/storage/${subDir}/${uniqueName}`;
    } catch (error) {
        console.error('Error al guardar el archivo localmente:', error);
        throw new Error('No se pudo guardar la imagen en el servidor.');
    }
}
