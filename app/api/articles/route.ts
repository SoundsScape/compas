import { NextRequest, NextResponse } from "next/server";
import { verifyAuth, authErrorResponse } from "@/server/middleware/auth";
import { ArticleService } from "@/server/services/article.service";
import { handleRouteError } from "@/server/utils/handleRouteError";
import { saveFileLocally } from "@/server/utils/uploadUtils";

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

        // Reconstrucción del objeto complejo desde FormData
        const body: any = {
            titulo: formData.get("titulo"),
            nombre_autor: formData.get("nombre_autor"),
            apellidos_autor: formData.get("apellidos_autor"),
            centro: formData.get("centro"),
            bibliografia: formData.get("bibliografia"),
            fecha: parseInt(formData.get("fecha") as string),
            latitud: formData.get("latitud"),
            longitud: formData.get("longitud"),
            id_autor: auth.user!.id, // Usamos el ID del usuario autenticado por defecto
            tags: [],
            plantillas: []
        };

        // Procesar Tags
        let tagIndex = 0;
        while (formData.has(`tags[${tagIndex}]`)) {
            body.tags.push(parseInt(formData.get(`tags[${tagIndex}]`) as string));
            tagIndex++;
        }

        // Procesar Plantillas
        let pIndex = 0;
        while (formData.has(`plantillas[${pIndex}][tipo]`)) {
            const plantilla: any = {
                tipo: formData.get(`plantillas[${pIndex}][tipo]`),
                order: parseInt(formData.get(`plantillas[${pIndex}][order]`) as string),
                shortCitation: formData.get(`plantillas[${pIndex}][shortCitation]`),
                textAreas: [],
                imageAreas: []
            };

            // Procesar TextAreas de la plantilla
            let taIndex = 0;
            while (formData.has(`plantillas[${pIndex}][textAreas][${taIndex}][value]`)) {
                plantilla.textAreas.push({
                    value: formData.get(`plantillas[${pIndex}][textAreas][${taIndex}][value]`),
                    order: taIndex
                });
                taIndex++;
            }

            // Procesar ImageAreas de la plantilla
            let iaIndex = 0;
            while (formData.has(`plantillas[${pIndex}][imageAreas][${iaIndex}][imageFooter]`)) {
                const imageFile = formData.get(`plantillas[${pIndex}][imageAreas][${iaIndex}][imageFile]`);
                let imagePath = "";

                if (imageFile instanceof File) {
                    const MAX_SIZE = 4 * 1024 * 1024; // 4MB
                    if (imageFile.size > MAX_SIZE) {
                        throw { status: 400, message: `La imagen ${imageFile.name} excede el límite de 4MB.` };
                    }
                    imagePath = await saveFileLocally(imageFile);
                }

                plantilla.imageAreas.push({
                    imagePath,
                    imageFooter: formData.get(`plantillas[${pIndex}][imageAreas][${iaIndex}][imageFooter]`),
                    order: iaIndex
                });
                iaIndex++;
            }

            body.plantillas.push(plantilla);
            pIndex++;
        }

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
