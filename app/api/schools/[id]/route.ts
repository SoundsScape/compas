import { NextRequest, NextResponse } from "next/server";
import { verifyAuth, authErrorResponse } from "@/server/middleware/auth";
import { SchoolService } from "@/server/services/school.service";
import { handleRouteError } from "@/server/utils/handleRouteError";

/**
 * GET /api/schools/[id]
 * Returns details for a specific school.
 */
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;

        // Solo usuarios autenticados pueden ver detalles
        const auth = await verifyAuth(req);
        if (auth.error) {
            return authErrorResponse(auth.error, auth.status || 401);
        }

        const school = await SchoolService.getSchoolById(Number(id));
        return NextResponse.json(school);

    } catch (error: any) {
        return handleRouteError(error);
    }
}

/**
 * PUT /api/schools/[id]
 * Updates an existing school.
 */
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;

        // Solo admin/superadmin pueden editar escuelas
        const auth = await verifyAuth(req, ["admin", "superadmin"]);
        if (auth.error) {
            return authErrorResponse(auth.error, auth.status || 401);
        }

        const body = await req.json();
        const updatedSchool = await SchoolService.updateSchool(Number(id), body);

        return NextResponse.json({
            message: "Escuela actualizada exitosamente.",
            school: updatedSchool
        });

    } catch (error: any) {
        return handleRouteError(error);
    }
}

/**
 * DELETE /api/schools/[id]
 * Deletes a school.
 */
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;

        // Solo admin/superadmin pueden borrar escuelas
        const auth = await verifyAuth(req, ["admin", "superadmin"]);
        if (auth.error) {
            return authErrorResponse(auth.error, auth.status || 401);
        }

        const result = await SchoolService.deleteSchool(Number(id));
        return NextResponse.json(result);

    } catch (error: any) {
        return handleRouteError(error);
    }
}
