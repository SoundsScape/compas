import { NextRequest, NextResponse } from "next/server";
import { verifyAuth, authErrorResponse } from "@/server/middleware/auth";
import { ArticleService } from "@/server/services/article.service";
import { handleRouteError } from "@/server/utils/handleRouteError";

export async function PATCH(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const { id } = params;

    try {
        // Verificar autenticación y rol (solo admins pueden validar)
        const auth = await verifyAuth(req, ["admin", "superadmin"]);
        if (auth.error) {
            return authErrorResponse(auth.error, auth.status || 401);
        }

        const result = await ArticleService.toggleValidation(Number(id));

        return NextResponse.json({
            success: true,
            message: `Artículo ${result.validated ? 'validado' : 'invalidado'} correctamente.`,
            ...result
        });
    } catch (error: any) {
        return handleRouteError(error);
    }
}
