import { NextRequest, NextResponse } from "next/server";
import { verifyAuth, authErrorResponse } from "@/server/middleware/auth";
import { SchoolService } from "@/server/services/school.service";
import { handleRouteError } from "@/server/utils/handleRouteError";

/**
 * GET /api/schools
 * Returns a list of all schools.
 */
export async function GET(req: NextRequest) {
    try {
        // Solo usuarios autenticados pueden ver escuelas
        const auth = await verifyAuth(req);
        if (auth.error) {
            return authErrorResponse(auth.error, auth.status || 401);
        }

        // Obtener parámetros de paginación de la URL
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");

        if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
            return NextResponse.json(
                { error: "Parametros invalidos para la paginacion." },
                { status: 400 }
            );
        }

        const schools = await SchoolService.getAllSchools(page, limit);
        return NextResponse.json(schools);

    } catch (error: any) {
        return handleRouteError(error);
    }
}

/**
 * POST /api/schools
 * Creates a new school.
 */
export async function POST(req: NextRequest) {
    try {
        // Solo admin/superadmin pueden crear escuelas
        const auth = await verifyAuth(req, ["admin", "superadmin"]);
        if (auth.error) {
            return authErrorResponse(auth.error, auth.status || 401);
        }

        const body = await req.json(); // TODO: Validar body con ZOD
        const newSchool = await SchoolService.createSchool(body);

        return NextResponse.json({
            message: "Escuela creada exitosamente.",
            school: newSchool
        }, { status: 201 });

    } catch (error: any) {
        return handleRouteError(error);
    }
}
