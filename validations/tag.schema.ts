import { z } from "zod";

export const tagSchema = z.object({
    name: z.string().min(1, "El nombre de la etiqueta es obligatorio").max(50, "El nombre es demasiado largo"),
});

export type TagInput = z.infer<typeof tagSchema>;
