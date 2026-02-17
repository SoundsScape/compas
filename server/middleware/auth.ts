import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma/client";

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET no está definido");
}

const JWT_SECRET = process.env.JWT_SECRET;

export interface AuthUser {
    id: string;
    email: string;
    role: string;
}

/**
 * Middleware para verificar la autenticación y roles.
 * Reemplaza la funcionalidad de auth:sanctum y RoleMiddleware de Laravel.
 */
export async function verifyAuth(req: NextRequest, allowedRoles?: string[]) {
    try {
        // 1. Obtener el token del header Authorization
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return { error: "No autorizado. Token faltante.", status: 401 };
        }

        const token = authHeader.split(" ")[1];

        // 2. Verificar el token
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        if (!decoded || !decoded.id) {
            return { error: "Token inválido o expirado.", status: 401 };
        }

        // 3. Buscar el usuario en la DB para verificar su estado actual
        // Esto imita el comportamiento de Laravel que siempre valida al usuario.
        const user = await prisma.users.findUnique({
            where: { id: BigInt(decoded.id) },
            include: {
                roles: true,
                statuses: true,
            },
        });

        if (!user) {
            return { error: "Usuario no encontrado.", status: 401 };
        }

        // 4. Verificar si el usuario está activo (Paso crítico migrado de Laravel)
        if (user.statuses.status_name !== "activo") {
            return { error: "Tu cuenta está inactiva. Contacta con un administrador.", status: 403 };
        }

        // 5. Verificar roles si se solicitan
        if (allowedRoles && allowedRoles.length > 0) {
            if (!allowedRoles.includes(user.roles.role_name)) {
                return { error: "No tienes permisos suficientes para esta acción.", status: 403 };
            }
        }

        // Retornar el usuario serializado (BigInt a String) para usarlo en el handler
        return {
            user: {
                id: user.id.toString(),
                email: user.email,
                role: user.roles.role_name,
            } as AuthUser,
            error: null
        };

    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return { error: "Error de autenticación.", status: 401 };
    }
}

/**
 * Función auxiliar para generar respuestas de error estandarizadas
 */
export function authErrorResponse(error: string, status: number) {
    return NextResponse.json({ message: error }, { status });
}
