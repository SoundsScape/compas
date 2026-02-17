import { prisma } from "@/lib/prisma/client";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";

// --- DTOs (Data Transfer Objects) para tipado fuerte ---

export interface CreateUserDTO {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name?: string;
    roles_id?: number;
    statuses_id?: number;
    school_id?: number;
    image_path?: string;
}

export interface UpdateUserDTO {
    username?: string;
    email?: string;
    password?: string;
    first_name?: string;
    last_name?: string;
    roles_id?: number;
    statuses_id?: number;
    school_id?: number;
    image_path?: string;
}

export class UserService {
    /**
     * Helper privado para limpiar objetos de usuario (BigInt a String y quitar password).
     */
    private static serializeUser(user: any) {
        if (!user) return null;

        // Clonamos para no mutar el original de Prisma
        const cleanUser = { ...user };

        // 1. Eliminar password si existe
        if ('password' in cleanUser) delete cleanUser.password;

        // 2. Convertir BigInts recursivamente a String para JSON
        return JSON.parse(
            JSON.stringify(cleanUser, (key, value) =>
                typeof value === "bigint" ? value.toString() : value
            )
        );
    }

    /**
     * Obtener todos los usuarios con selección explícita de campos.
     */
    static async getAllUsers() {
        try {
            const users = await prisma.users.findMany({
                include: {
                    roles: true,
                    statuses: true,
                    schools: true,
                },
            });
            return users.map(user => this.serializeUser(user));
        } catch (error) {
            console.error("UserService.getAllUsers Error:", error);
            throw {
                status: 500,
                message: "Error al obtener la lista de usuarios."
            };
        }
    }

    /**
     * Obtener un usuario específico por ID.
     */
    static async getUserById(id: number) {
        try {
            const user = await prisma.users.findUnique({
                where: { id: BigInt(id) },
                include: {
                    roles: true,
                    statuses: true,
                    schools: true,
                },
            });

            if (!user) {
                throw { status: 404, message: "Usuario no encontrado." };
            }

            return this.serializeUser(user);
        } catch (error: any) {
            if (error.status) throw error;
            console.error("UserService.getUserById Error:", error);
            throw { status: 500, message: "Error al obtener el usuario." };
        }
    }

    /**
     * Crear un nuevo usuario (equivalente a UserController@store).
     */
    static async createUser(data: CreateUserDTO) {
        try {
            // Encriptar la contraseña (Laravel usa Hash::make, nosotros bcrypt)
            const hashedPassword = await bcrypt.hash(data.password, 12);

            // Construimos el objeto explícitamente para evitar inyección de campos no deseados
            const user = await prisma.users.create({
                data: {
                    username: data.username,
                    email: data.email,
                    password: hashedPassword,
                    first_name: data.first_name,
                    last_name: data.last_name || null,
                    roles_id: BigInt(data.roles_id || 1),
                    statuses_id: BigInt(data.statuses_id || 1),
                    school_id: data.school_id ? BigInt(data.school_id) : null,
                    image_path: data.image_path || null,
                },
                include: {
                    roles: true,
                    statuses: true,
                    schools: true,
                }
            });

            return this.serializeUser(user);
        } catch (error) {
            // Error conocido de Prisma
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                // Código P2002 = unique constraint failed
                if (error.code === "P2002") {
                    throw {
                        status: 409,
                        message: "Email o username ya existe."
                    };
                }
            }
            // Error inesperado
            throw {
                status: 500,
                message: "Error al crear usuario."
            };
        }
    }

    /**
     * Actualizar un usuario existente de forma segura.
     */
    static async updateUser(id: number, data: UpdateUserDTO) {
        try {
            // Construimos el objeto de actualización de forma explícita
            const updateData: any = {};

            if (data.username !== undefined) updateData.username = data.username;
            if (data.email !== undefined) updateData.email = data.email;
            if (data.first_name !== undefined) updateData.first_name = data.first_name;
            if (data.last_name !== undefined) updateData.last_name = data.last_name;
            if (data.roles_id !== undefined) updateData.roles_id = BigInt(data.roles_id);
            if (data.statuses_id !== undefined) updateData.statuses_id = BigInt(data.statuses_id);
            if (data.school_id !== undefined) updateData.school_id = data.school_id ? BigInt(data.school_id) : null;
            if (data.image_path !== undefined) updateData.image_path = data.image_path;
            if (data.password !== undefined) {
                updateData.password = await bcrypt.hash(data.password, 12);
            }

            const user = await prisma.users.update({
                where: { id: BigInt(id) },
                data: updateData,
                include: {
                    roles: true,
                    statuses: true,
                    schools: true,
                }
            });

            return this.serializeUser(user);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw { status: 409, message: "Email o username ya existe." };
                }
                if (error.code === "P2025") {
                    throw { status: 404, message: "Usuario no encontrado para actualizar." };
                }
            }
            console.error("UserService.updateUser Error:", error);
            throw { status: 500, message: "Error al actualizar el usuario." };
        }
    }

    /**
     * Eliminar un usuario.
     */
    static async deleteUser(id: number) {
        try {
            const deletedUser = await prisma.users.delete({
                where: { id: BigInt(id) }
            });
            return this.serializeUser(deletedUser);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    throw { status: 404, message: "Usuario no encontrado para eliminar." };
                }
            }
            console.error("UserService.deleteUser Error:", error);
            throw { status: 500, message: "Error al eliminar el usuario." };
        }
    }
}
