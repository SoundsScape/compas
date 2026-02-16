import { NextResponse } from "next/server";

export async function POST() {
    // Con JWT, el logout es principalmente del lado del cliente removiendo el token.
    // Devolvemos éxito para mantener la compatibilidad con el frontend actual.
    return NextResponse.json({ success: true, message: "Logged out" });
}
