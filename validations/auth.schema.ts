import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Formato de email inválido"),
    password: z.string().min(1, "La contraseña es obligatoria"),
});

export const registerSchema = z.object({
    username: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
    email: z.string().email("Formato de email inválido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    first_name: z.string().min(1, "El nombre es obligatorio"),
    last_name: z.string().optional(),
    school_id: z.number().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
