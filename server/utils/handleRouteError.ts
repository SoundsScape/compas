import { NextResponse } from "next/server";

export function handleRouteError(error: any) {
    return NextResponse.json(
        { message: error.message || "Internal Server Error" },
        { status: error.status || 500 }
    );
}
