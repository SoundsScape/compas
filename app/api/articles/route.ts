import { NextRequest, NextResponse } from "next/server";
import { verifyAuth, authErrorResponse } from "@/server/middleware/auth";
import { ArticleService } from "@/server/services/article.service";
import { handleRouteError } from "@/server/utils/handleRouteError";
import { parseArticleFormData } from "@/server/utils/articleRequestParser";

export const maxDuration = 60; // 60 seconds
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

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
        const isAdmin = !auth.error && (auth.user?.role === "admin" || auth.user?.role === "superadmin" || auth.user?.role === "teacher");

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "1000");

        if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1 || limit > 1000) {
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
        const auth = await verifyAuth(req, ["admin", "superadmin", "student", "teacher"]);
        if (auth.error) {
            return authErrorResponse(auth.error, auth.status || 401);
        }

        const formData = await req.formData();
        const body = await parseArticleFormData(formData, Number(auth.user!.id));

        const article = await ArticleService.createArticle(body, {
            id: auth.user!.id,
            role: auth.user!.role
        });

        return NextResponse.json({
            message: "Artículo creado exitosamente.",
            article
        }, { status: 201 });

    } catch (error: any) {
        console.error("Error in POST /api/articles:", error);
        return handleRouteError(error);
    }
}
