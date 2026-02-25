import { z } from "zod";

export const createUserSchema = z.object({
    username: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
    email: z.string().email("Formato de email inválido"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    first_name: z.string().min(1, "El nombre es obligatorio"),
    last_name: z.string().optional().nullable(),
    roles_id: z.number().int().positive().optional(),
    statuses_id: z.number().int().positive().optional(),
    school_id: z.number().int().positive().optional().nullable(),
    image_path: z.string().optional().nullable(),
});

export const updateUserSchema = createUserSchema.partial().extend({
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
