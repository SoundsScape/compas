import { NextRequest, NextResponse } from "next/server";
import { verifyAuth, authErrorResponse } from "@/server/middleware/auth";
import { ArticleService } from "@/server/services/article.service";
import { handleRouteError } from "@/server/utils/handleRouteError";

export const dynamic = 'force-dynamic';

/**
 * GET /api/articles/mine
 * Returns articles belonging to the authenticated user.
 */
export async function GET(req: NextRequest) {
    try {
        // 1. Verificar autenticación
        const auth = await verifyAuth(req);
        if (auth.error) {
            return authErrorResponse(auth.error, auth.status || 401);
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");

        if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1 || limit > 100) {
            return NextResponse.json(
                { message: "Parámetros de paginación inválidos." },
                { status: 400 }
            );
        }

        // 2. Obtener artículos propios mediante el servicio
        const result = await ArticleService.getUserArticles(Number(auth.user!.id), page, limit);

        return NextResponse.json(result);

    } catch (error: any) {
        console.error("Error in GET /api/articles/mine:", error);
        return handleRouteError(error);
    }
}
