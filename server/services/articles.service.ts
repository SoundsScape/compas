import { prisma } from "@/lib/prisma/client";

export class ArticlesService {
    /**
     * Obtiene todos los artículos validados con sus etiquetas y plantillas.
     */
    static async getArticles() {
        try {
            const articles = await prisma.articles.findMany({
                where: {
                    validated: true,
                },
                include: {
                    article_tag: {
                        include: {
                            tags: true,
                        },
                    },
                    article_templates: {
                        include: {
                            text_areas: true,
                            image_areas: true,
                        },
                        orderBy: {
                            order: "asc",
                        },
                    },
                },
                orderBy: {
                    fecha: "desc",
                },
            });
            return articles;
        } catch (error) {
            console.error("Error fetching articles:", error);
            throw new Error("No se pudieron cargar los artículos");
        }
    }

    /**
     * Obtiene un artículo por su ID.
     */
    static async getArticleById(id: number | bigint) {
        try {
            const article = await prisma.articles.findUnique({
                where: {
                    id: BigInt(id),
                },
                include: {
                    article_tag: {
                        include: {
                            tags: true,
                        },
                    },
                    article_templates: {
                        include: {
                            text_areas: true,
                            image_areas: true,
                        },
                        orderBy: {
                            order: "asc",
                        },
                    },
                },
            });
            return article;
        } catch (error) {
            console.error(`Error fetching article ${id}:`, error);
            throw new Error("No se pudo cargar el artículo");
        }
    }
}
