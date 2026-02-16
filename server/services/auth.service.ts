import { prisma } from "@/lib/prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET no está definido");
}

const JWT_SECRET = process.env.JWT_SECRET;

export class AuthService {
    /**
     * Valida las credenciales del usuario y genera un token JWT.
     */
    static async login(email: string, password: string) {
        try {
            // 1. Buscar usuario con sus relaciones (rol, estado, escuela)
            const user = await prisma.users.findUnique({
                where: { email },
                include: {
                    roles: true,
                    statuses: true,
                    schools: true,
                },
            });

            if (!user) {
                throw new Error("Credenciales inválidas");
            }

            if (!user.roles) {
                throw new Error("Usuario sin rol asignado");
            }

            // 2. Verificar contraseña con bcrypt (compatible con Laravel)
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                throw new Error("Credenciales inválidas");
            }

            // 3. Generar Token JWT
            const token = jwt.sign(
                {
                    id: user.id.toString(),
                    email: user.email,
                    role: user.roles.role_name
                },
                JWT_SECRET,
                { expiresIn: "24h" }
            );

            // 4. Preparar objeto de usuario para el frontend (sin el hash de la password)
            const { password: _, ...userWithoutPassword } = user;

            // Serialización de BigInt
            const serializedUser = JSON.parse(
                JSON.stringify(userWithoutPassword, (key, value) =>
                    typeof value === "bigint" ? value.toString() : value
                )
            );

            return {
                token,
                user: serializedUser,
            };
        } catch (error) {
            console.error("AuthService Error:", error);
            throw error;
        }
    }
}
