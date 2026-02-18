import { NextRequest, NextResponse } from "next/server";
import { verifyAuth, authErrorResponse } from "@/server/middleware/auth";
import { RoleService } from "@/server/services/role.service";
import { handleRouteError } from "@/server/utils/handleRouteError";

/**
 * GET /api/roles
 * List all roles with pagination.
 */
export async function GET(req: NextRequest) {
    try {
        const auth = await verifyAuth(req);
        if (auth.error) return authErrorResponse(auth.error, auth.status || 401);

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");

        if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
            return NextResponse.json(
                { message: "Parámetros de paginación inválidos." },
                { status: 400 }
            );
        }

        const roles = await RoleService.getAllRoles(page, limit);
        return NextResponse.json(roles);
    } catch (error: any) {
        return handleRouteError(error);
    }
}

/**
 * POST /api/roles
 * Create a new role.
 */
export async function POST(req: NextRequest) {
    try {
        const auth = await verifyAuth(req, ["admin", "superadmin"]);
        if (auth.error) return authErrorResponse(auth.error, auth.status || 401);

        const body = await req.json();
        const role = await RoleService.createRole(body);
        return NextResponse.json({ message: "Rol creado correctamente", role }, { status: 201 });
    } catch (error: any) {
        return handleRouteError(error);
    }
}
