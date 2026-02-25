import { NextRequest, NextResponse } from "next/server";
import { verifyAuth, authErrorResponse } from "@/server/middleware/auth";
import { ArticleService } from "@/server/services/article.service";
import { handleRouteError } from "@/server/utils/handleRouteError";

/**
 * GET /api/articles
 * Returns a list of articles.
 * - Public: Only validated.
 * - Admin/Superadmin: All.
 */
export async function GET(req: NextRequest) {
    try {
        // Verificar si el usuario es admin para mostrar no validados
        const auth = await verifyAuth(req);
        const isAdmin = !auth.error && (auth.user?.role === "admin" || auth.user?.role === "superadmin");

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "100");

        if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1 || limit > 100) {
            return NextResponse.json(
                { message: "Parámetros de paginación inválidos." },
                { status: 400 }
            );
        }

        const onlyValidated = !isAdmin;

        const result = await ArticleService.getAllArticles(page, limit, onlyValidated);
        return NextResponse.json(result);

    } catch (error: any) {
        return handleRouteError(error);
    }
}

/**
 * POST /api/articles
 * Creates a new article with templates and content blocks.
 */
export async function POST(req: NextRequest) {
    try {
        // Solo admin/superadmin pueden crear artículos
        const auth = await verifyAuth(req, ["admin", "superadmin"]);
        if (auth.error) {
            return authErrorResponse(auth.error, auth.status || 401);
        }

        const body = await req.json();
        const article = await ArticleService.createArticle(body, {
            id: auth.user!.id,
            role: auth.user!.role
        });

        return NextResponse.json({
            message: "Artículo creado exitosamente.",
            article
        }, { status: 201 });

    } catch (error: any) {
        return handleRouteError(error);
    }
}
