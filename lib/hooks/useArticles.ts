import { useState, useEffect, useMemo } from 'react';
import { getArticles } from '@/lib/services/articleService';
import { Article } from '@/lib/interfaces/article.interface';
import { getHistoricalPeriod } from '@/lib/utils/historicalPeriods';

export function useArticles(filters: any) {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    // 1. Cargar artículos
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const data = await getArticles();
                setArticles(data);
            } catch (error) {
                console.error('Error al cargar artículos:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, []);

    // 2. Filtrar artículos
    const filteredEvents = useMemo(() => {
        return articles.filter(article => {
            // Filtro por año
            if (
                article.fecha < filters.yearRange[0] ||
                article.fecha > filters.yearRange[1]
            )
                return false;

            // Filtro por búsqueda de texto
            if (
                filters.search &&
                !article.titulo
                    .toLowerCase()
                    .includes(filters.search.toLowerCase()) &&
                !(article.templates?.[0]?.text_areas?.[0]?.content || '')
                    .toLowerCase()
                    .includes(filters.search.toLowerCase())
            ) {
                return false;
            }
            // Filtro por categoría (período histórico)
            if (
                filters.categories.length > 0 &&
                !filters.categories.includes(getHistoricalPeriod(article.fecha))
            )
                return false;

            // Filtro por tipo de evento
            if (
                filters.eventTypes.length > 0 &&
                !(
                    article.templates?.[0]?.type &&
                    filters.eventTypes.includes(article.templates[0].type)
                ) &&
                !(
                    article.tags &&
                    article.tags.some(tag =>
                        filters.eventTypes.includes(tag.name)
                    )
                )
            ) {
                return false;
            }

            // Filtro por región
            if (
                filters.regions.length > 0 &&
                !filters.regions.includes(article.centro)
            )
                return false;

            return true;
        });
    }, [articles, filters]);

    return {
        articles: filteredEvents,
        loading,
    };
}
