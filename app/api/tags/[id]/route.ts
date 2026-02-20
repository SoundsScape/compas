import { NextRequest, NextResponse } from "next/server";
import { verifyAuth, authErrorResponse } from "@/server/middleware/auth";
import { TagsService } from "@/server/services/tags.service";
import { handleRouteError } from "@/server/utils/handleRouteError";

export async function GET(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const { id } = params;
    try {
        const tag = await TagsService.getTagById(Number(id));
        if (!tag) {
            return NextResponse.json({ message: "Etiqueta no encontrada." }, { status: 404 });
        }

        return NextResponse.json(tag);
    } catch (error: any) {
        return handleRouteError(error);
    }
}

export async function PUT(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await verifyAuth(req, ["admin", "superadmin"]);
        if (auth.error) {
            return authErrorResponse(auth.error, auth.status || 401);
        }

        const { id } = await props.params;
        const body = await req.json();
        const tag = await TagsService.updateTag(Number(id), body);

        return NextResponse.json({ message: "Etiqueta actualizada exitosamente.", tag });
    } catch (error: any) {
        return handleRouteError(error);
    }
}

export async function DELETE(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await verifyAuth(req, ["admin", "superadmin"]);
        if (auth.error) {
            return authErrorResponse(auth.error, auth.status || 401);
        }

        const { id } = await props.params;
        await TagsService.deleteTag(Number(id));
        return NextResponse.json({ message: "Etiqueta eliminada exitosamente." });
    } catch (error: any) {
        return handleRouteError(error);
    }
}
