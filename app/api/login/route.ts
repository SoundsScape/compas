import { NextResponse } from "next/server";
import { AuthService } from "@/server/services/auth.service";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: "Email y contraseña son obligatorios" },
                { status: 400 }
            );
        }

        const authData = await AuthService.login(email, password);

        return NextResponse.json({
            message: "Login successful",
            ...authData
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message || "Error en la autenticación" },
            { status: 401 }
        );
    }
}
