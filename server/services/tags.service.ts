import { prisma } from "@/lib/prisma/client";
/**
 * Helper para serializar BigInt a string
 */
export const serialize = <T>(data: T) =>
    JSON.parse(JSON.stringify(data, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
    ));

export interface TagDTO {
    name: string;
}

export class TagsService {
    /**
     * Validación de datos de tag
     */
    private static validateTagData(data: Partial<TagDTO>, isUpdate: boolean = false) {
        if (!isUpdate) {
            if (!data.name || data.name.trim() === "") {
                throw { status: 400, message: "El campo 'name' es obligatorio para crear una etiqueta." };
            }
        }

        if (data.name !== undefined && (typeof data.name !== "string" || data.name.trim() === "")) {
            throw { status: 400, message: "El campo 'name' debe ser una cadena de texto no vacía." };
        }
    }

    /** Obtener todas las etiquetas */
    static async getTags() {
        try {
            const tags = await prisma.tags.findMany({ orderBy: { name: "asc" } });
            return serialize(tags);
        } catch (error) {
            console.error("TagsService.getTags Error:", error);
            throw { status: 500, message: "Error al obtener las etiquetas." };
        }
    }

    static async getTagById(id: number | bigint) {
        try {
            const tag = await prisma.tags.findUnique({ where: { id: BigInt(id) } });
            return serialize(tag);
        } catch (error) {
            console.error("TagsService.getTagById Error:", error);
            throw { status: 500, message: "Error al obtener la etiqueta." };
        }
    }

    /** Crear una etiqueta */
    static async createTag(data: { name: string }) {
        try {
            this.validateTagData(data);
            const tag = await prisma.tags.create({ data: { name: data.name } });
            return serialize(tag);
        } catch (error) {
            console.error("TagsService.createTag Error:", error);
            throw error;
        }
    }

    /** Actualizar una etiqueta */
    static async updateTag(id: number | bigint, data: Partial<TagDTO>) {
        try {
            this.validateTagData(data, true);
            const updateData: Partial<TagDTO> = {};
            if (data.name !== undefined) updateData.name = data.name;

            const tag = await prisma.tags.update({
                where: { id: BigInt(id) },
                data: updateData
            });
            return serialize(tag);
        } catch (error: any) {
            if (error.status) throw error;
            console.error("TagsService.updateTag Error:", error);
            throw { status: 500, message: "Error al actualizar la etiqueta." };
        }
    }

    /** Eliminar una etiqueta */
    static async deleteTag(id: number | bigint) {
        try {
            await prisma.tags.delete({ where: { id: BigInt(id) } });
            return { message: "Etiqueta eliminada exitosamente." };
        } catch (error: any) {
            console.error("TagsService.deleteTag Error:", error);
            throw { status: 500, message: "Error al eliminar la etiqueta." };
        }
    }
}
