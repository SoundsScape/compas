import { prisma } from "@/lib/prisma/client";
import { Prisma } from "@prisma/client";

// --- DTOs (Data Transfer Objects) ---

export interface CreateArticleDTO {
    titulo: string;
    nombre_autor: string;
    apellidos_autor: string;
    id_autor: string; // Recibido como string (id de usuario)
    centro: string;
    latitud: string;
    longitud: string;
    bibliografia?: string;
    fecha: number;
    plantillas: Array<{
        tipo: string;
        shortCitation?: string;
        textAreas?: Array<{
            value: string;
        }>;
        imageAreas?: Array<{
            imagePath: string;
            imageFooter?: string;
        }>;
    }>;
    tags?: number[]; // IDs de las etiquetas
}

export interface UpdateArticleDTO extends Partial<CreateArticleDTO> {
    validated?: boolean;
}

export class ArticleService {
    /**
     * Helper privado para limpiar objetos (BigInt a String).
     */
    private static serialize(data: any) {
        if (!data) return null;
        return JSON.parse(
            JSON.stringify(data, (key, value) =>
                typeof value === "bigint" ? value.toString() : value
            )
        );
    }

    /**
     * Valida la estructura interna del artículo (plantillas, textAreas, imageAreas).
     */
    private static validateArticleStructure(data: Partial<CreateArticleDTO>) {
        if (data.plantillas !== undefined) {
            if (!Array.isArray(data.plantillas)) {
                throw { status: 400, message: "El campo 'plantillas' debe ser un array." };
            }

            for (const [idx, p] of data.plantillas.entries()) {
                if (!p.tipo || typeof p.tipo !== 'string' || p.tipo.trim() === '') {
                    throw { status: 400, message: `La plantilla en la posición ${idx} debe tener un 'tipo' válido.` };
                }

                if (p.textAreas !== undefined && !Array.isArray(p.textAreas)) {
                    throw { status: 400, message: `El campo 'textAreas' en la plantilla ${idx} debe ser un array.` };
                }

                if (p.imageAreas !== undefined && !Array.isArray(p.imageAreas)) {
                    throw { status: 400, message: `El campo 'imageAreas' en la plantilla ${idx} debe ser un array.` };
                }

                // Validar contenido básico si existen los arrays
                p.textAreas?.forEach((ta, taIdx) => {
                    if (ta.value === undefined || ta.value === null) {
                        throw { status: 400, message: `El textArea ${taIdx} de la plantilla ${idx} debe tener un valor ('value').` };
                    }
                });

                p.imageAreas?.forEach((ia, iaIdx) => {
                    if (!ia.imagePath) {
                        throw { status: 400, message: `El imageArea ${iaIdx} de la plantilla ${idx} debe tener una ruta de imagen ('imagePath').` };
                    }
                });
            }
        }

        if (data.tags !== undefined && !Array.isArray(data.tags)) {
            throw { status: 400, message: "El campo 'tags' debe ser un array." };
        }
    }

    /**
     * Obtener artículos con paginación y filtros.
     */
    static async getAllArticles(page: number = 1, limit: number = 10, onlyValidated: boolean = false) {
        try {
            const skip = (page - 1) * limit;
            const where: Prisma.articlesWhereInput = onlyValidated ? { validated: true } : {};

            const [articles, total] = await Promise.all([
                prisma.articles.findMany({
                    where,
                    skip,
                    take: limit,
                    include: {
                        article_tag: {
                            include: { tags: true }
                        },
                        article_templates: {
                            include: {
                                text_areas: true,
                                image_areas: true,
                            },
                            orderBy: { order: "asc" }
                        }
                    },
                    orderBy: { created_at: "desc" }
                }),
                prisma.articles.count({ where })
            ]);

            return {
                data: this.serialize(articles),
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            console.error("ArticleService.getAllArticles Error:", error);
            throw { status: 500, message: "Error al obtener artículos." };
        }
    }

    /**
     * Obtener un artículo por ID con todas sus relaciones.
     */
    static async getArticleById(id: number) {
        try {
            const article = await prisma.articles.findUnique({
                where: { id: BigInt(id) },
                include: {
                    article_tag: {
                        include: { tags: true }
                    },
                    article_templates: {
                        include: {
                            text_areas: true,
                            image_areas: true,
                        },
                        orderBy: { order: "asc" }
                    }
                }
            });

            if (!article) throw { status: 404, message: "Artículo no encontrado." };

            return this.serialize(article);
        } catch (error: any) {
            if (error.status) throw error;
            console.error("ArticleService.getArticleById Error:", error);
            throw { status: 500, message: "Error al cargar el artículo." };
        }
    }

    /**
     * Crear un artículo con sus plantillas y áreas anidadas.
     * Seguridad: Valida tags, existencia de autor y previene suplantación si no es admin.
     */
    static async createArticle(data: CreateArticleDTO, authenticatedUser: { id: string; role: string }) {
        try {
            // 0. Validar estructura básica
            this.validateArticleStructure(data);

            // 1. Validar que los tags existan (si se envían)
            if (data.tags && data.tags.length > 0) {
                const existingTags = await prisma.tags.findMany({
                    where: { id: { in: data.tags.map(id => BigInt(id)) } }
                });
                if (existingTags.length !== data.tags.length) {
                    throw { status: 400, message: "Uno o más tags proporcionados no existen." };
                }
            }

            // 2. Determinar el ID del autor real
            let finalAuthorId = BigInt(authenticatedUser.id);

            // Si es admin/superadmin, permitimos especificar otro autor
            if ((authenticatedUser.role === 'admin' || authenticatedUser.role === 'superadmin') && data.id_autor) {
                const userExists = await prisma.users.findUnique({
                    where: { id: BigInt(data.id_autor) }
                });
                if (!userExists) {
                    throw { status: 400, message: "El ID de autor especificado no existe." };
                }
                finalAuthorId = BigInt(data.id_autor);
            }

            const article = await prisma.articles.create({
                data: {
                    titulo: data.titulo,
                    nombre_autor: data.nombre_autor,
                    apellidos_autor: data.apellidos_autor,
                    id_autor: finalAuthorId,
                    centro: data.centro,
                    latitud: data.latitud,
                    longitud: data.longitud,
                    bibliografia: data.bibliografia || "",
                    fecha: data.fecha,
                    validated: false,
                    // Escritura anidada para plantillas (Atómica y eficiente)
                    article_templates: {
                        create: data.plantillas.map((p, idx) => ({
                            type: p.tipo,
                            order: idx,
                            shortCitation: p.shortCitation || null,
                            text_areas: {
                                create: p.textAreas?.map((ta, taIdx) => ({
                                    content: ta.value,
                                    order: taIdx
                                })) || []
                            },
                            image_areas: {
                                create: p.imageAreas?.map((ia, iaIdx) => ({
                                    imagePath: ia.imagePath,
                                    imageFooter: ia.imageFooter || "",
                                    order: iaIdx
                                })) || []
                            }
                        }))
                    },
                    // Escritura anidada para etiquetas
                    article_tag: {
                        create: data.tags?.map(tagId => ({
                            tag_id: BigInt(tagId)
                        })) || []
                    }
                },
                include: {
                    article_templates: {
                        include: {
                            text_areas: true,
                            image_areas: true
                        }
                    },
                    article_tag: true
                }
            });

            return this.serialize(article);
        } catch (error: any) {
            if (error.status) throw error;
            console.error("ArticleService.createArticle Error:", error);
            throw { status: 500, message: "Error al crear el artículo." };
        }
    }

    /**
     * Actualizar un artículo de forma robusta.
     * Estrategia: Actualización transaccional que reemplaza etiquetas y plantillas para asegurar integridad.
     */
    static async updateArticle(id: number, data: UpdateArticleDTO, authenticatedUser: { id: string; role: string }) {
        try {
            // 0. Validar estructura básica
            this.validateArticleStructure(data);

            // 1. Validaciones previas de integridad
            if (data.tags && data.tags.length > 0) {
                const existingTags = await prisma.tags.findMany({
                    where: { id: { in: data.tags.map(t => BigInt(t)) } }
                });
                if (existingTags.length !== data.tags.length) {
                    throw { status: 400, message: "Uno o más tags proporcionados no existen." };
                }
            }

            if (data.id_autor) {
                const userExists = await prisma.users.findUnique({
                    where: { id: BigInt(data.id_autor) }
                });
                if (!userExists) {
                    throw { status: 400, message: "El ID de autor especificado no existe." };
                }
            }

            return await prisma.$transaction(async (tx) => {
                // 1. Si se envían nuevas etiquetas, borrar las anteriores y crear las nuevas
                if (data.tags !== undefined) {
                    await tx.article_tag.deleteMany({
                        where: { article_id: BigInt(id) }
                    });

                    if (data.tags.length > 0) {
                        await tx.article_tag.createMany({
                            data: data.tags.map(tagId => ({
                                article_id: BigInt(id),
                                tag_id: BigInt(tagId)
                            }))
                        });
                    }
                }

                // 2. Si se envían nuevas plantillas, aplicar estrategia de reemplazo (Clear & Create)
                if (data.plantillas !== undefined) {
                    // Borrar plantillas antiguas (la cascada borrará text_areas e image_areas)
                    await tx.article_templates.deleteMany({
                        where: { article_id: BigInt(id) }
                    });

                    // Crear las nuevas
                    for (const [idx, p] of data.plantillas.entries()) {
                        await tx.article_templates.create({
                            data: {
                                type: p.tipo,
                                order: idx,
                                shortCitation: p.shortCitation || null,
                                article_id: BigInt(id),
                                text_areas: {
                                    create: p.textAreas?.map((ta, taIdx) => ({
                                        content: ta.value,
                                        order: taIdx
                                    })) || []
                                },
                                image_areas: {
                                    create: p.imageAreas?.map((ia, iaIdx) => ({
                                        imagePath: ia.imagePath,
                                        imageFooter: ia.imageFooter || "",
                                        order: iaIdx
                                    })) || []
                                }
                            }
                        });
                    }
                }

                // 3. Actualizar campos básicos del artículo (respetando ID_AUTOR si se permite cambiar)
                const updateData: any = {};

                if (data.titulo !== undefined) updateData.titulo = data.titulo;
                if (data.nombre_autor !== undefined) updateData.nombre_autor = data.nombre_autor;
                if (data.apellidos_autor !== undefined) updateData.apellidos_autor = data.apellidos_autor;
                if (data.centro !== undefined) updateData.centro = data.centro;
                if (data.latitud !== undefined) updateData.latitud = data.latitud;
                if (data.longitud !== undefined) updateData.longitud = data.longitud;
                if (data.bibliografia !== undefined) updateData.bibliografia = data.bibliografia;
                if (data.fecha !== undefined) updateData.fecha = data.fecha;
                if (data.validated !== undefined) updateData.validated = data.validated;

                // Solo admins pueden cambiar el autor de un artículo ya existente
                if ((authenticatedUser.role === 'admin' || authenticatedUser.role === 'superadmin') && data.id_autor) {
                    updateData.id_autor = BigInt(data.id_autor);
                }

                const updatedArticle = await tx.articles.update({
                    where: { id: BigInt(id) },
                    data: updateData,
                    include: {
                        article_tag: { include: { tags: true } },
                        article_templates: {
                            include: {
                                text_areas: true,
                                image_areas: true
                            },
                            orderBy: { order: "asc" }
                        }
                    }
                });

                return this.serialize(updatedArticle);
            });
        } catch (error: any) {
            if (error.status) throw error;
            console.error("ArticleService.updateArticle Error:", error);
            throw { status: 500, message: "Error al actualizar el artículo." };
        }
    }

    /**
     * Eliminar un artículo (Cascada gestionada por DB/Prisma).
     */
    static async deleteArticle(id: number) {
        try {
            await prisma.articles.delete({
                where: { id: BigInt(id) }
            });
            return { message: "Artículo eliminado correctamente." };
        } catch (error) {
            console.error("ArticleService.deleteArticle Error:", error);
            throw { status: 500, message: "Error al eliminar el artículo." };
        }
    }

    /**
     * Validar o invalidar un artículo.
     */
    static async toggleValidation(id: number) {
        try {
            const article = await prisma.articles.findUnique({
                where: { id: BigInt(id) }
            });
            if (!article) throw { status: 404, message: "Artículo no encontrado." };

            const updated = await prisma.articles.update({
                where: { id: BigInt(id) },
                data: { validated: !article.validated }
            });

            return { validated: updated.validated };
        } catch (error: any) {
            if (error.status) throw error;
            console.error("ArticleService.toggleValidation Error:", error);
            throw { status: 500, message: "Error al validar el artículo." };
        }
    }
}
