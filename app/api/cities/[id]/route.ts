import { NextRequest, NextResponse } from "next/server";
import { verifyAuth, authErrorResponse } from "@/server/middleware/auth";
import { CitiesService } from "@/server/services/cities.service";
import { handleRouteError } from "@/server/utils/handleRouteError";
import { serializeBigInt } from "@/server/utils/serialize";

export async function GET(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const { id } = params;
    try {
        const city = await CitiesService.getCityById(Number(id));
        if (!city) {
            return NextResponse.json({ message: "Ciudad no encontrada." }, { status: 404 });
        }

        return NextResponse.json(serializeBigInt(city));
    } catch (error: any) {
        return handleRouteError(error);
    }
}

export async function PUT(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const { id } = params;
    try {
        const auth = await verifyAuth(req, ["admin", "superadmin"]);
        if (auth.error) {
            return authErrorResponse(auth.error, auth.status || 401);
        }

        const body = await req.json();
        const city = await CitiesService.updateCity(Number(id), body);

        return NextResponse.json({ message: "Ciudad actualizada exitosamente.", city });
    } catch (error: any) {
        return handleRouteError(error);
    }
}

export async function DELETE(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const { id } = params;
    try {
        const auth = await verifyAuth(req, ["admin", "superadmin"]);
        if (auth.error) {
            return authErrorResponse(auth.error, auth.status || 401);
        }

        await CitiesService.deleteCity(Number(id));
        return NextResponse.json({ message: "Ciudad eliminada exitosamente." });
    } catch (error: any) {
        return handleRouteError(error);
    }
}
