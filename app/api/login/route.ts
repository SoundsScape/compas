import { NextResponse } from "next/server";
import { AuthService } from "@/server/services/auth.service";
import { handleRouteError } from "@/server/utils/handleRouteError";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const authData = await AuthService.login(body);

        return NextResponse.json({
            message: "Login successful",
            ...authData
        });
    } catch (error: any) {
        return handleRouteError(error);
    }
}
