import { NextRequest, NextResponse } from "next/server";
import { verifyAuth, authErrorResponse } from "@/server/middleware/auth";
import { UserService } from "@/server/services/user.service";
import { handleRouteError } from "@/server/utils/handleRouteError";

/**
 * GET /api/users/[id]
 * Replaces UserController@show in Laravel.
 * Returns details for a specific user.
 */
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // En Next.js 15, params es una Promise
        const { id } = await params;

        // 1. Verificar autenticación
        const auth = await verifyAuth(req);
        if (auth.error) {
            return authErrorResponse(auth.error, auth.status || 401);
        }

        if (auth.user && auth.user.role !== "admin" && auth.user.role !== "superadmin" && auth.user.id !== id) {
            throw { status: 403, message: "Forbidden" };
        }

        // 2. Obtener usuario mediante el servicio
        const user = await UserService.getUserById(Number(id));

        return NextResponse.json(user);

    } catch (error: any) {
        return handleRouteError(error);
    }
}

/**
 * PUT /api/users/[id]
 * Replaces UserController@update in Laravel.
 * Updates an existing user.
 */
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;

        // 1. Verificar autenticación y roles (Solo admin/superadmin pueden editar)
        const auth = await verifyAuth(req, ["admin", "superadmin"]);
        if (auth.error) {
            return authErrorResponse(auth.error, auth.status || 401);
        }

        // 2. Obtener datos del cuerpo
        const body = await req.json();

        // 3. Actualizar mediante el servicio
        const updatedUser = await UserService.updateUser(Number(id), body);

        return NextResponse.json({
            message: "User updated successfully",
            user: updatedUser
        });

    } catch (error: any) {
        return handleRouteError(error);
    }
}

/**
 * DELETE /api/users/[id]
 * Replaces UserController@destroy in Laravel.
 * Deletes a user.
 */
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;

        // 1. Verificar autenticación y roles
        const auth = await verifyAuth(req, ["admin", "superadmin"]);
        if (auth.error) {
            return authErrorResponse(auth.error, auth.status || 401);
        }

        // 2. Eliminar mediante el servicio
        await UserService.deleteUser(Number(id));

        return NextResponse.json({
            message: "User deleted successfully"
        });

    } catch (error: any) {
        return handleRouteError(error);
    }
}
