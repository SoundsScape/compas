import { z } from "zod";

export const textAreaSchema = z.object({
    value: z.string().max(3500, "El contenido del bloque de texto no puede superar los 3500 caracteres"),
    order: z.number().int().optional(),
});

export const imageAreaSchema = z.object({
    imagePath: z.string().min(1, "La ruta de la imagen es obligatoria"),
    imageFooter: z.string().max(50, "El pie de foto no puede superar los 50 caracteres").optional().nullable(),
    order: z.number().int().optional(),
});

export const plantillaSchema = z.object({
    tipo: z.string().min(1, "El tipo de plantilla es obligatorio"),
    shortCitation: z.string().optional().nullable(),
    textAreas: z.array(textAreaSchema).optional(),
    imageAreas: z.array(imageAreaSchema).optional(),
    order: z.number().int().optional(),
});

export const createArticleSchema = z.object({
    titulo: z.string().min(1, "El título es obligatorio"),
    nombre_autor: z.string().min(1, "El nombre del autor es obligatorio"),
    apellidos_autor: z.string().min(1, "Los apellidos del autor son obligatorios"),
    id_autor: z.string().min(1, "El ID del autor es obligatorio"),
    centro: z.string().min(1, "El centro es obligatorio"),
    latitud: z.string().min(1, "La latitud es obligatoria"),
    longitud: z.string().min(1, "La longitud es obligatoria"),
    bibliografia: z.string().optional().nullable(),
    fecha: z.number().int(),
    plantillas: z.array(plantillaSchema).min(1, "Debe haber al menos una plantilla"),
    tags: z.array(z.number()).optional(),
});

export const updateArticleSchema = createArticleSchema.partial().extend({
    validated: z.boolean().optional(),
});

export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
