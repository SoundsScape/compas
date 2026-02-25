import { z } from "zod";

export const createSchoolSchema = z.object({
    name: z.string().min(1, "El nombre de la escuela es obligatorio").max(45, "El nombre es demasiado largo"),
    address: z.string().min(1, "La dirección es obligatoria").max(255, "La dirección es demasiado larga"),
    contact_mail: z.string().email("Formato de email inválido").max(45, "El email es demasiado largo"),
    contact_phone: z.string().min(1, "El teléfono de contacto es obligatorio").max(45, "El teléfono es demasiado largo"),
});

export const updateSchoolSchema = createSchoolSchema.partial();

export type CreateSchoolInput = z.infer<typeof createSchoolSchema>;
export type UpdateSchoolInput = z.infer<typeof updateSchoolSchema>;
