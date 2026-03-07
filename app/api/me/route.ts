import { NextRequest, NextResponse } from "next/server";
import { verifyAuth, authErrorResponse } from "@/server/middleware/auth";
import { prisma } from "@/lib/prisma/client";

export async function GET(req: NextRequest) {
    try {
        // 1. Verificar autenticación
        const auth = await verifyAuth(req);

        if (auth.error) {
            return authErrorResponse(auth.error, auth.status || 401);
        }

        // 2. Obtener el usuario completo con sus relaciones
        const user = await prisma.users.findUnique({
            where: { id: BigInt(auth.user!.id) },
            include: {
                roles: true,
                statuses: true,
                schools: true,
            },
        });

        if (!user) {
            return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
        }

        // 3. Serializar y responder (sin la contraseña)
        const { password, ...userWithoutPassword } = user;

        const serializedUser = JSON.parse(
            JSON.stringify(userWithoutPassword, (key, value) =>
                typeof value === "bigint" ? value.toString() : value
            )
        );

        return NextResponse.json({
            ...serializedUser,
            role: serializedUser.roles?.role_name || "student",
            school: serializedUser.schools,
            name: `${serializedUser.first_name} ${serializedUser.last_name || ""}`.trim() || serializedUser.username
        });

    } catch (error) {
        console.error("API Me Error:", error);
        return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
    }
}
