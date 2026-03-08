import { prisma } from "@/lib/prisma/client";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { createUserSchema, updateUserSchema, CreateUserInput, UpdateUserInput } from "@/validations/user.schema";

export class UserService {
    /**
     * Mapea el objeto de Prisma al formato del frontend.
     * Convierte BigInt a String, quita el password y renombra relaciones a singular.
     */
    private static mapToFrontend(data: any): any {
        if (!data) return null;

        if (Array.isArray(data)) {
            return data.map(item => this.mapToFrontend(item));
        }

        // 1. Serialización básica (BigInt -> String y quitar password)
        const serialized = JSON.parse(
            JSON.stringify(data, (key, value) => {
                if (key === 'password') return undefined;
                return typeof value === "bigint" ? value.toString() : value;
            })
        );

        // 2. Renombrar relaciones a singular para el frontend
        const mapped: any = { ...serialized };

        if (serialized.roles) {
            mapped.role = serialized.roles;
            delete mapped.roles;
        }
        if (serialized.statuses) {
            mapped.status = serialized.statuses;
            delete mapped.statuses;
        }
        if (serialized.schools) {
            mapped.school = serialized.schools;
            delete mapped.schools;
        }

        return mapped;
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
            return this.mapToFrontend(users);
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

            return this.mapToFrontend(user);
        } catch (error: any) {
            if (error.status) throw error;
            console.error("UserService.getUserById Error:", error);
            throw { status: 500, message: "Error al obtener el usuario." };
        }
    }

    /**
     * Crear un nuevo usuario (equivalente a UserController@store).
     */
    static async createUser(data: CreateUserInput) {
        try {
            const validatedData = createUserSchema.parse(data);

            // Encriptar la contraseña (Laravel usa Hash::make, nosotros bcrypt)
            const hashedPassword = await bcrypt.hash(validatedData.password, 12);
            console.log(validatedData);
            // Construimos el objeto explícitamente para evitar inyección de campos no deseados
            const user = await prisma.users.create({
                data: {
                    username: validatedData.username,
                    email: validatedData.email,
                    password: hashedPassword,
                    first_name: validatedData.first_name,
                    last_name: validatedData.last_name || null,
                    roles_id: BigInt(validatedData.roles_id || 1),
                    statuses_id: BigInt(validatedData.statuses_id || 1),
                    school_id: validatedData.school_id ? BigInt(validatedData.school_id) : null,
                    image_path: validatedData.image_path || null,
                },
                include: {
                    roles: true,
                    statuses: true,
                    schools: true,
                }
            });

            return this.mapToFrontend(user);
        } catch (error: any) {
            console.error("UserService.createUser Error details:", error);

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
    static async updateUser(id: number, data: UpdateUserInput) {
        try {
            const validatedData = updateUserSchema.parse(data);

            // Construimos el objeto de actualización de forma explícita
            const updateData: any = {};

            if (validatedData.username !== undefined) updateData.username = validatedData.username;
            if (validatedData.email !== undefined) updateData.email = validatedData.email;
            if (validatedData.first_name !== undefined) updateData.first_name = validatedData.first_name;
            if (validatedData.last_name !== undefined) updateData.last_name = validatedData.last_name;
            if (validatedData.roles_id !== undefined) updateData.roles_id = BigInt(validatedData.roles_id);
            if (validatedData.statuses_id !== undefined) updateData.statuses_id = BigInt(validatedData.statuses_id);
            if (validatedData.school_id !== undefined) updateData.school_id = validatedData.school_id ? BigInt(validatedData.school_id) : null;
            if (validatedData.image_path !== undefined) updateData.image_path = validatedData.image_path;
            if (validatedData.password !== undefined) {
                updateData.password = await bcrypt.hash(validatedData.password, 12);
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

            return this.mapToFrontend(user);
        } catch (error: any) {
            console.error("UserService.updateUser Error details:", error);

            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw { status: 409, message: "Email o username ya existe." };
                }
                if (error.code === "P2025") {
                    throw { status: 404, message: "Usuario no encontrado para actualizar." };
                }
            }

            // Si es un error de validación de Zod, relanzarlo para que handleRouteError lo maneje (o manejarlo aquí)
            if (error.name === "ZodError") {
                throw { status: 400, message: "Error de validación", details: error.errors };
            }

            // Si ya tiene un status definido, simplemente relanzar
            if (error.status) throw error;

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
            return this.mapToFrontend(deletedUser);
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
