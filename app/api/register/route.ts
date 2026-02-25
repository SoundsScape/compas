import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/server/services/user.service";
import { handleRouteError } from "@/server/utils/handleRouteError";

/**
 * POST /api/register
 * En el backend migrado, el registro usa el UserService para crear
 * un usuario con rol y estado por defecto.
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Forzamos valores por defecto seguros para registro público
        // role_id 1 suele ser 'usuario' y status_id 1 'activo' según la migración.
        const userData = {
            ...body,
            roles_id: 1, // Usuario estándar
            statuses_id: 1 // Activo por defecto
        };

        const newUser = await UserService.createUser(userData);

        return NextResponse.json(
            {
                message: "Usuario registrado exitosamente.",
                user: newUser
            },
            { status: 201 }
        );
    } catch (error: any) {
        return handleRouteError(error);
    }
}
