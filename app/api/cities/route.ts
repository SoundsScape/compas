import { NextRequest, NextResponse } from "next/server";
import { verifyAuth, authErrorResponse } from "@/server/middleware/auth";
import { CitiesService } from "@/server/services/cities.service";
import { handleRouteError } from "@/server/utils/handleRouteError";
import { serializeBigInt } from "@/server/utils/serialize";

export async function GET() {
    try {
        const cities = await CitiesService.getCities();
        return NextResponse.json(serializeBigInt(cities));
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
        const city = await CitiesService.createCity(body);

        return NextResponse.json(
            { message: "Ciudad creada exitosamente.", city },
            { status: 201 }
        );
    } catch (error: any) {
        return handleRouteError(error);
    }
}
