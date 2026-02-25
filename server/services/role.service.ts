import { prisma } from "@/lib/prisma/client";
import { Prisma } from "@prisma/client";

export interface CreateRoleDTO {
    role_name: string;
    description?: string;
}

export interface UpdateRoleDTO {
    role_name?: string;
    description?: string;
}

export class RoleService {
    private static serializeRole(role: any) {
        if (!role) return null;
        return JSON.parse(
            JSON.stringify(role, (key, value) =>
                typeof value === "bigint" ? value.toString() : value
            )
        );
    }

    /**
     * Obtener todos los roles con paginación.
     */
    static async getAllRoles(page: number = 1, limit: number = 20) {
        try {
            const skip = (page - 1) * limit;
            const [roles, total] = await Promise.all([
                prisma.roles.findMany({
                    skip,
                    take: limit,
                    orderBy: { id: 'asc' },
                    include: { users: true }
                }),
                prisma.roles.count()
            ]);

            return {
                data: roles.map(role => ({
                    ...this.serializeRole(role),
                    usersCount: role.users.length
                })),
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            console.error("RoleService.getAllRoles Error:", error);
            throw { status: 500, message: "Error al obtener la lista de roles." };
        }
    }

    static async getRoleById(id: number) {
        try {
            const role = await prisma.roles.findUnique({
                where: { id: BigInt(id) },
                include: { users: true },
            });
            if (!role) throw { status: 404, message: "Rol no encontrado." };
            return {
                ...this.serializeRole(role),
                usersCount: role.users.length
            };
        } catch (error: any) {
            if (error.status) throw error;
            console.error("RoleService.getRoleById Error:", error);
            throw { status: 500, message: "Error al obtener el rol." };
        }
    }

    static async createRole(data: CreateRoleDTO) {
        try {
            const role = await prisma.roles.create({
                data: {
                    role_name: data.role_name,
                    description: data.description || null,
                }
            });
            return this.serializeRole(role);
        } catch (error) {
            console.error("RoleService.createRole Error:", error);
            throw { status: 500, message: "Error al crear el rol." };
        }
    }

    static async updateRole(id: number, data: UpdateRoleDTO) {
        try {
            const updateData: any = {};
            if (data.role_name !== undefined) updateData.role_name = data.role_name;
            if (data.description !== undefined) updateData.description = data.description;

            const role = await prisma.roles.update({
                where: { id: BigInt(id) },
                data: updateData
            });
            return this.serializeRole(role);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
                throw { status: 404, message: "Rol no encontrado para actualizar." };
            }
            console.error("RoleService.updateRole Error:", error);
            throw { status: 500, message: "Error al actualizar el rol." };
        }
    }

    static async deleteRole(id: number) {
        try {
            await prisma.roles.delete({
                where: { id: BigInt(id) }
            });
            return { message: "Rol eliminado correctamente." };
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    throw { status: 404, message: "Rol no encontrado para eliminar." };
                }
                if (error.code === "P2003") {
                    throw { status: 400, message: "No se puede eliminar el rol porque tiene usuarios asociados." };
                }
            }
            console.error("RoleService.deleteRole Error:", error);
            throw { status: 500, message: "Error al eliminar el rol." };
        }
    }
}
