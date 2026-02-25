import { prisma } from "@/lib/prisma/client";
import { Prisma } from "@prisma/client";

export interface CreateStatusDTO {
    status_name: string;
    description?: string;
}

export interface UpdateStatusDTO {
    status_name?: string;
    description?: string;
}

export class StatusService {
    private static serializeStatus(status: any) {
        if (!status) return null;
        return JSON.parse(
            JSON.stringify(status, (key, value) =>
                typeof value === "bigint" ? value.toString() : value
            )
        );
    }

    /**
     * Obtener todos los estados con paginación.
     */
    static async getAllStatuses(page: number = 1, limit: number = 20) {
        try {
            const skip = (page - 1) * limit;
            const [statuses, total] = await Promise.all([
                prisma.statuses.findMany({
                    skip,
                    take: limit,
                    orderBy: { id: 'asc' },
                    include: { users: true }
                }),
                prisma.statuses.count()
            ]);

            return {
                data: statuses.map(status => ({
                    ...this.serializeStatus(status),
                    usersCount: status.users.length
                })),
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            console.error("StatusService.getAllStatuses Error:", error);
            throw { status: 500, message: "Error al obtener la lista de estados." };
        }
    }

    static async getStatusById(id: number) {
        try {
            const status = await prisma.statuses.findUnique({
                where: { id: BigInt(id) },
                include: { users: true }
            });
            if (!status) throw { status: 404, message: "Estado no encontrado." };
            return {
                ...this.serializeStatus(status),
                usersCount: status.users.length
            };
        } catch (error: any) {
            if (error.status) throw error;
            console.error("StatusService.getStatusById Error:", error);
            throw { status: 500, message: "Error al obtener el estado." };
        }
    }

    static async createStatus(data: CreateStatusDTO) {
        try {
            const status = await prisma.statuses.create({
                data: {
                    status_name: data.status_name,
                    description: data.description || null,
                }
            });
            return this.serializeStatus(status);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
                throw { status: 409, message: "El nombre de estado ya existe." };
            }
            console.error("StatusService.createStatus Error:", error);
            throw { status: 500, message: "Error al crear el estado." };
        }
    }

    static async updateStatus(id: number, data: UpdateStatusDTO) {
        try {
            const updateData: any = {};
            if (data.status_name !== undefined) updateData.status_name = data.status_name;
            if (data.description !== undefined) updateData.description = data.description;

            const status = await prisma.statuses.update({
                where: { id: BigInt(id) },
                data: updateData
            });
            return this.serializeStatus(status);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw { status: 409, message: "El nombre de estado ya está en uso." };
                }
                if (error.code === "P2025") {
                    throw { status: 404, message: "Estado no encontrado para actualizar." };
                }
            }
            console.error("StatusService.updateStatus Error:", error);
            throw { status: 500, message: "Error al actualizar el estado." };
        }
    }

    static async deleteStatus(id: number) {
        try {
            await prisma.statuses.delete({
                where: { id: BigInt(id) }
            });
            return { message: "Estado eliminado correctamente." };
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    throw { status: 404, message: "Estado no encontrado para eliminar." };
                }
                if (error.code === "P2003") {
                    throw { status: 400, message: "No se puede eliminar el estado porque tiene registros asociados." };
                }
            }
            console.error("StatusService.deleteStatus Error:", error);
            throw { status: 500, message: "Error al eliminar el estado." };
        }
    }
}
