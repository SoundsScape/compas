import { prisma } from "@/lib/prisma/client";
import { Prisma } from "@prisma/client";

// --- DTOs (Data Transfer Objects) para tipado fuerte ---

export interface CreateSchoolDTO {
    name: string;
    address: string;
    contact_mail: string;
    contact_phone: string;
}

export interface UpdateSchoolDTO {
    name?: string;
    address?: string;
    contact_mail?: string;
    contact_phone?: string;
}

export class SchoolService {
    /**
     * Helper privado para limpiar objetos de escuela (BigInt a String si los hay).
     */
    private static serializeSchool(school: any) {
        if (!school) return null;

        return JSON.parse(
            JSON.stringify(school, (key, value) =>
                typeof value === "bigint" ? value.toString() : value
            )
        );
    }

    /**
     * Obtener todas las escuelas con paginación.
     */
    static async getAllSchools(page: number = 1, limit: number = 10) {
        try {
            const skip = (page - 1) * limit;
            const [schools, total] = await Promise.all([
                prisma.schools.findMany({
                    skip,
                    take: limit,
                    orderBy: { created_at: 'desc' }
                }),
                prisma.schools.count()
            ]);

            return {
                data: schools.map(school => this.serializeSchool(school)),
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            console.error("SchoolService.getAllSchools Error:", error);
            throw {
                status: 500,
                message: "Error al obtener la lista de escuelas."
            };
        }
    }

    /**
     * Obtener una escuela específica por ID.
     */
    static async getSchoolById(id: number) {
        try {
            const school = await prisma.schools.findUnique({
                where: { id: BigInt(id) },
            });

            if (!school) {
                throw { status: 404, message: "Escuela no encontrada." };
            }

            return this.serializeSchool(school);
        } catch (error: any) {
            if (error.status) throw error;
            console.error("SchoolService.getSchoolById Error:", error);
            throw { status: 500, message: "Error al obtener la escuela." };
        }
    }

    /**
     * Crear una nueva escuela.
     */
    static async createSchool(data: CreateSchoolDTO) {
        try {
            const school = await prisma.schools.create({
                data: {
                    name: data.name,
                    address: data.address,
                    contact_mail: data.contact_mail,
                    contact_phone: data.contact_phone,
                }
            });

            return this.serializeSchool(school);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw {
                        status: 409,
                        message: "El email de contacto ya está registrado para otra escuela."
                    };
                }
            }
            console.error("SchoolService.createSchool Error:", error);
            throw { status: 500, message: "Error al crear la escuela." };
        }
    }

    /**
     * Actualizar una escuela existente de forma segura.
     */
    static async updateSchool(id: number, data: UpdateSchoolDTO) {
        try {
            // Mapping explícito para evitar inyección de campos no deseados
            const updateData: any = {};
            if (data.name !== undefined) updateData.name = data.name;
            if (data.address !== undefined) updateData.address = data.address;
            if (data.contact_mail !== undefined) updateData.contact_mail = data.contact_mail;
            if (data.contact_phone !== undefined) updateData.contact_phone = data.contact_phone;

            const school = await prisma.schools.update({
                where: { id: BigInt(id) },
                data: updateData
            });

            return this.serializeSchool(school);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw { status: 409, message: "El email de contacto ya está en uso." };
                }
                if (error.code === "P2025") {
                    throw { status: 404, message: "Escuela no encontrada para actualizar." };
                }
            }
            console.error("SchoolService.updateSchool Error:", error);
            throw { status: 500, message: "Error al actualizar la escuela." };
        }
    }

    /**
     * Eliminar una escuela.
     */
    static async deleteSchool(id: number) {
        try {
            await prisma.schools.delete({
                where: { id: BigInt(id) }
            });
            return { message: "Escuela eliminada correctamente." };
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    throw { status: 404, message: "Escuela no encontrada para eliminar." };
                }
                if (error.code === "P2003") {
                    throw { status: 400, message: "No se puede eliminar la escuela porque tiene registros asociados." };
                }
            }
            console.error("SchoolService.deleteSchool Error:", error);
            throw { status: 500, message: "Error al eliminar la escuela." };
        }
    }
}
