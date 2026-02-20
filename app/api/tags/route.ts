import { NextRequest, NextResponse } from "next/server";
import { verifyAuth, authErrorResponse } from "@/server/middleware/auth";
import { TagsService } from "@/server/services/tags.service";
import { handleRouteError } from "@/server/utils/handleRouteError";

export async function GET() {
    try {
        const tags = await TagsService.getTags();
        return NextResponse.json(tags);
    } catch (error: any) {
        return handleRouteError(error);
    }
}

export async function POST(req: NextRequest) {
    try {
        const auth = await verifyAuth(req, ["admin", "superadmin"]);
        if (auth.error) {
            return authErrorResponse(auth.error, auth.status || 401);
        }

        const body = await req.json();
        const tag = await TagsService.createTag(body);

        return NextResponse.json(
            { message: "Etiqueta creada exitosamente.", tag },
            { status: 201 }
        );
    } catch (error: any) {
        return handleRouteError(error);
    }
}
