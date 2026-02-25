import { NextRequest, NextResponse } from "next/server";
import { verifyAuth, authErrorResponse } from "@/server/middleware/auth";
import { UserService } from "@/server/services/user.service";
import { handleRouteError } from "@/server/utils/handleRouteError";

/**
 * GET /api/users
 * Replaces UserController@index in Laravel.
 * Returns a list of all users.
 */
export async function GET(req: NextRequest) {
    try {
        // 1. Verificar autenticación y roles (Solo admin y superadmin pueden listar usuarios)
        const auth = await verifyAuth(req, ["admin", "superadmin"]);
        if (auth.error) {
            return authErrorResponse(auth.error, auth.status || 401);
        }

        // 2. Obtener usuarios mediante el servicio
        const users = await UserService.getAllUsers();

        return NextResponse.json(users);

    } catch (error: any) {
        return handleRouteError(error);
    }
}

/**
 * POST /api/users
 * Replaces UserController@store in Laravel.
 * Creates a new user.
 */
export async function POST(req: NextRequest) {
    try {
        // 1. Verificar autenticación y roles (Solo admin y superadmin pueden crear usuarios)
        const auth = await verifyAuth(req, ["admin", "superadmin"]);
        if (auth.error) {
            return authErrorResponse(auth.error, auth.status || 401);
        }

        // 2. Obtener datos del cuerpo de la petición
        const body = await req.json();

        // 3. Crear usuario mediante el servicio
        const newUser = await UserService.createUser(body);

        return NextResponse.json({
            message: "User registered successfully",
            user: newUser
        }, { status: 201 });

    } catch (error: any) {
        return handleRouteError(error);
    }
}
