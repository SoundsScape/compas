import { NextRequest, NextResponse } from "next/server";
import { verifyAuth, authErrorResponse } from "@/server/middleware/auth";
import { StatusService } from "@/server/services/status.service";
import { handleRouteError } from "@/server/utils/handleRouteError";

/**
 * GET /api/statuses
 * List all statuses with pagination.
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

        const statuses = await StatusService.getAllStatuses(page, limit);
        return NextResponse.json(statuses);
    } catch (error: any) {
        return handleRouteError(error);
    }
}

/**
 * POST /api/statuses
 * Create a new status.
 */
export async function POST(req: NextRequest) {
    try {
        const auth = await verifyAuth(req, ["admin", "superadmin"]);
        if (auth.error) return authErrorResponse(auth.error, auth.status || 401);

        const body = await req.json();
        const status = await StatusService.createStatus(body);
        return NextResponse.json({ message: "Estado creado correctamente", status }, { status: 201 });
    } catch (error: any) {
        return handleRouteError(error);
    }
}
