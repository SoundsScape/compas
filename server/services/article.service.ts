import { prisma } from "@/lib/prisma/client";
import { Prisma } from "@prisma/client";
import { createArticleSchema, updateArticleSchema, CreateArticleInput, UpdateArticleInput } from "@/validations/article.schema";

export class ArticleService {
    /**
     * Mapea un objeto de base de datos (Prisma) al formato que espera el frontend.
     * Convierte BigInt a String y renombra relaciones (article_templates -> templates, article_tag -> tags).
     */
    private static mapToFrontend(data: any): any {
        if (!data) return null;

        if (Array.isArray(data)) {
            return data.map(item => this.mapToFrontend(item));
        }

        // 1. Serialización básica de BigInt (usando el helper o lógica interna)
        const serialized = JSON.parse(
            JSON.stringify(data, (key, value) =>
                typeof value === "bigint" ? value.toString() : value
            )
        );

        // 2. Renombrar relaciones y aplanar tags
        const mapped: any = { ...serialized };

        // Renombrar article_templates -> templates
        if (serialized.article_templates) {
            mapped.templates = serialized.article_templates;
            delete mapped.article_templates;
        }

        // Renombrar y aplanar article_tag -> tags
        if (serialized.article_tag) {
            mapped.tags = serialized.article_tag.map((at: any) => {
                const tagObj = at.tags || {};
                return {
                    ...tagObj,
                    pivot: {
                        article_id: at.article_id,
                        tag_id: at.tag_id,
                        created_at: at.created_at,
                        updated_at: at.updated_at
                    }
                };
            });
            delete mapped.article_tag;
        }

        return mapped;
    }

    /**
     * Obtener artículos con paginación y filtros.
     */
    static async getAllArticles(page: number = 1, limit: number = 1000, onlyValidated: boolean = false) {
        try {
            const skip = (page - 1) * limit;
            const where: Prisma.articlesWhereInput = onlyValidated ? { validated: true } : {};

            const [articles, total, validatedCount, pendingCount] = await Promise.all([
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
                prisma.articles.count({ where }),
                prisma.articles.count({ where: { validated: true } }),
                prisma.articles.count({ where: { validated: false } })
            ]);

            return {
                data: this.mapToFrontend(articles),
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                    validatedCount,
                    pendingCount
                }
            };
        } catch (error) {
            console.error("ArticleService.getAllArticles Error:", error);
            throw { status: 500, message: "Error al obtener artículos." };
        }
    }

    /**
     * Obtener artículos de un usuario específico con paginación y estadísticas.
     */
    static async getUserArticles(userId: number, page: number = 1, limit: number = 10) {
        try {
            const skip = (page - 1) * limit;
            const where: Prisma.articlesWhereInput = { id_autor: BigInt(userId) };

            const [articles, total, validatedCount, pendingCount] = await Promise.all([
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
                prisma.articles.count({ where }),
                prisma.articles.count({ where: { ...where, validated: true } }),
                prisma.articles.count({ where: { ...where, validated: false } })
            ]);

            return {
                data: this.mapToFrontend(articles),
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                    validatedCount,
                    pendingCount
                }
            };
        } catch (error) {
            console.error("ArticleService.getUserArticles Error:", error);
            throw { status: 500, message: "Error al obtener los artículos del usuario." };
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

            return this.mapToFrontend(article);
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
    static async createArticle(data: CreateArticleInput, authenticatedUser: { id: string; role: string }) {
        try {
            // 0. Validar estructura básica con Zod
            const validatedData = createArticleSchema.parse(data);

            // 1. Validar que los tags existan (si se envían)
            if (validatedData.tags && validatedData.tags.length > 0) {
                const existingTags = await prisma.tags.findMany({
                    where: { id: { in: validatedData.tags.map(id => BigInt(id)) } }
                });
                if (existingTags.length !== validatedData.tags.length) {
                    throw { status: 400, message: "Uno o más tags proporcionados no existen." };
                }
            }

            // 2. Determinar el ID del autor real
            let finalAuthorId = BigInt(authenticatedUser.id);

            // Si es admin/superadmin, permitimos especificar otro autor
            if ((authenticatedUser.role === 'admin' || authenticatedUser.role === 'superadmin') && validatedData.id_autor) {
                const userExists = await prisma.users.findUnique({
                    where: { id: BigInt(validatedData.id_autor) }
                });
                if (!userExists) {
                    throw { status: 400, message: "El ID de autor especificado no existe." };
                }
                finalAuthorId = BigInt(validatedData.id_autor);
            }

            const article = await prisma.articles.create({
                data: {
                    titulo: validatedData.titulo,
                    nombre_autor: validatedData.nombre_autor,
                    apellidos_autor: validatedData.apellidos_autor,
                    id_autor: finalAuthorId,
                    centro: validatedData.centro,
                    latitud: validatedData.latitud,
                    longitud: validatedData.longitud,
                    bibliografia: validatedData.bibliografia || "",
                    fecha: validatedData.fecha,
                    validated: false,
                    // Escritura anidada para plantillas (Atómica y eficiente)
                    article_templates: {
                        create: validatedData.plantillas.map((p: any, idx: number) => ({
                            type: p.tipo,
                            order: idx,
                            shortCitation: p.shortCitation || null,
                            text_areas: {
                                create: p.textAreas?.map((ta: any, taIdx: number) => ({
                                    content: ta.value,
                                    order: taIdx
                                })) || []
                            },
                            image_areas: {
                                create: p.imageAreas?.map((ia: any, iaIdx: number) => ({
                                    imagePath: ia.imagePath,
                                    imageFooter: ia.imageFooter || "",
                                    order: iaIdx
                                })) || []
                            }
                        }))
                    },
                    // Escritura anidada para etiquetas
                    article_tag: {
                        create: validatedData.tags?.map((tagId: number) => ({
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

            return this.mapToFrontend(article);
        } catch (error: any) {
            // No envolver errores que ya tienen status o son ZodErrors (estos debe manejarlos el handleRouteError)
            if (error.status || error.name === 'ZodError') throw error;

            console.error("CRITICAL ArticleService.createArticle Error:", error);
            throw {
                status: 500,
                message: `Error interno al crear el artículo: ${error.message || 'Error desconocido'}`
            };
        }
    }

    /**
     * Actualizar un artículo de forma robusta.
     * Estrategia: Actualización transaccional que reemplaza etiquetas y plantillas para asegurar integridad.
     */
    static async updateArticle(id: number, data: UpdateArticleInput, authenticatedUser: { id: string; role: string }) {
        try {
            // 0. Validar estructura con Zod
            const validatedData = updateArticleSchema.parse(data);

            // 1. Validar que los tags existan (si se envían)
            if (validatedData.tags && validatedData.tags.length > 0) {
                const existingTags = await prisma.tags.findMany({
                    where: { id: { in: validatedData.tags.map(id => BigInt(id)) } }
                });
                if (existingTags.length !== validatedData.tags.length) {
                    throw { status: 400, message: "Uno o más tags proporcionados no existen." };
                }
            }

            return await prisma.$transaction(async (tx) => {
                // 1. Si se envían nuevas etiquetas, borrar las anteriores y crear las nuevas
                if (validatedData.tags !== undefined) {
                    await tx.article_tag.deleteMany({
                        where: { article_id: BigInt(id) }
                    });

                    if (validatedData.tags.length > 0) {
                        await tx.article_tag.createMany({
                            data: (validatedData.tags as number[]).map(tagId => ({
                                article_id: BigInt(id),
                                tag_id: BigInt(tagId)
                            }))
                        });
                    }
                }

                // 2. Si se envían nuevas plantillas, aplicar estrategia de reemplazo (Clear & Create)
                if (validatedData.plantillas !== undefined) {
                    // Borrar plantillas antiguas (la cascada borrará text_areas e image_areas)
                    await tx.article_templates.deleteMany({
                        where: { article_id: BigInt(id) }
                    });

                    // Crear las nuevas
                    for (const [idx, p] of validatedData.plantillas.entries()) {
                        await tx.article_templates.create({
                            data: {
                                type: p.tipo,
                                order: idx,
                                shortCitation: p.shortCitation || null,
                                article_id: BigInt(id),
                                text_areas: {
                                    create: p.textAreas?.map((ta: { value: string }, taIdx: number) => ({
                                        content: ta.value,
                                        order: taIdx
                                    })) || []
                                },
                                image_areas: {
                                    create: p.imageAreas?.map((ia: { imagePath: string, imageFooter?: string | null }, iaIdx: number) => ({
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

                return this.mapToFrontend(updatedArticle);
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
