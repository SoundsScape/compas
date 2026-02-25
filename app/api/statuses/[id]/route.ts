import { NextRequest, NextResponse } from "next/server";
import { verifyAuth, authErrorResponse } from "@/server/middleware/auth";
import { StatusService } from "@/server/services/status.service";
import { handleRouteError } from "@/server/utils/handleRouteError";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const auth = await verifyAuth(req);
        if (auth.error) return authErrorResponse(auth.error, auth.status || 401);

        const status = await StatusService.getStatusById(Number(id));
        return NextResponse.json(status);
    } catch (error: any) {
        return handleRouteError(error);
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const auth = await verifyAuth(req, ["admin", "superadmin"]);
        if (auth.error) return authErrorResponse(auth.error, auth.status || 401);

        const body = await req.json();
        const status = await StatusService.updateStatus(Number(id), body);
        return NextResponse.json(status);
    } catch (error: any) {
        return handleRouteError(error);
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const auth = await verifyAuth(req, ["admin", "superadmin"]);
        if (auth.error) return authErrorResponse(auth.error, auth.status || 401);

        const result = await StatusService.deleteStatus(Number(id));
        return NextResponse.json(result);
    } catch (error: any) {
        return handleRouteError(error);
    }
}
