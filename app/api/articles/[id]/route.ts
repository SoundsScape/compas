import { NextRequest, NextResponse } from "next/server";
import { verifyAuth, authErrorResponse } from "@/server/middleware/auth";
import { ArticleService } from "@/server/services/article.service";
import { handleRouteError } from "@/server/utils/handleRouteError";

/**
 * GET /api/articles/[id]
 * Returns full details of an article.
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const article = await ArticleService.getArticleById(Number(id));

        // Si no está validado, solo admin puede verlo
        if (!article.validated) {
            const auth = await verifyAuth(req, ["admin", "superadmin"]);
            if (auth.error) {
                return authErrorResponse("No autorizado para ver artículos no validados.", 403);
            }
        }

        return NextResponse.json(article);

    } catch (error: any) {
        return handleRouteError(error);
    }
}

/**
 * PUT /api/articles/[id]
 * Updates an article.
 */
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Solo admin/superadmin pueden editar
        const auth = await verifyAuth(req, ["admin", "superadmin"]);
        if (auth.error) {
            return authErrorResponse(auth.error, auth.status || 401);
        }

        const body = await req.json();
        const updatedArticle = await ArticleService.updateArticle(Number(id), body, {
            id: auth.user!.id,
            role: auth.user!.role
        });

        return NextResponse.json({
            message: "Artículo actualizado exitosamente.",
            article: updatedArticle
        });

    } catch (error: any) {
        return handleRouteError(error);
    }
}

/**
 * DELETE /api/articles/[id]
 * Deletes an article.
 */
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Solo admin/superadmin pueden borrar
        const auth = await verifyAuth(req, ["admin", "superadmin"]);
        if (auth.error) {
            return authErrorResponse(auth.error, auth.status || 401);
        }

        const result = await ArticleService.deleteArticle(Number(id));
        return NextResponse.json(result);

    } catch (error: any) {
        return handleRouteError(error);
    }
}