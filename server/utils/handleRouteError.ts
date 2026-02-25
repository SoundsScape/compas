import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function handleRouteError(error: any) {
    if (error instanceof ZodError) {
        return NextResponse.json(
            {
                message: "Error de validación",
                errors: error.flatten().fieldErrors
            },
            { status: 400 }
        );
    }

    return NextResponse.json(
        { message: error.message || "Internal Server Error" },
        { status: error.status || 500 }
    );
}
