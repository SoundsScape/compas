"use client";

import { useEffect, useState } from 'react';
import ArticleCard from '@/components/sections/articles/ArticleCard';
import { Plus, Search, Newspaper } from 'lucide-react';
import Link from 'next/link';
import { getArticles } from '@/lib/services/articleService';
import { Article } from '@/lib/interfaces/article.interface';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import ArticleModal from '@/components/shared/articles/ArticleModal';
import Filters from '@/components/sections/home/Filters';
import { getHistoricalPeriod } from '@/lib/utils/historicalPeriods';

const MIN_YEAR = -35000;
const MAX_YEAR = new Date().getFullYear();

export default function ArticlesPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Initial Filter State
    const [filters, setFilters] = useState({
        search: '',
        yearRange: [MIN_YEAR, MAX_YEAR] as [number, number],
        categories: [] as string[],
        eventTypes: [] as string[],
        regions: [] as string[]
    });

    const setSelectedYearRange = (range: [number, number]) => {
        setFilters(prev => ({
            ...prev,
            yearRange: range
        }));
    };

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);
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

    const filteredArticles = articles.filter(article => {
        const matchesSearch =
            article.titulo.toLowerCase().includes(filters.search.toLowerCase()) ||
            article.nombre_autor.toLowerCase().includes(filters.search.toLowerCase()) ||
            article.apellidos_autor.toLowerCase().includes(filters.search.toLowerCase());

        const matchesYearRange =
            article.fecha >= filters.yearRange[0] && article.fecha <= filters.yearRange[1];

        const historicalPeriod = getHistoricalPeriod(article.fecha);
        const matchesCategories =
            filters.categories.length === 0 || filters.categories.includes(historicalPeriod);

        const matchesEventTypes =
            filters.eventTypes.length === 0 ||
            (article.tags && article.tags.some(tag => filters.eventTypes.includes(tag.name)));

        return matchesSearch && matchesYearRange && matchesCategories && matchesEventTypes;
    });

    return (
        <div className='min-h-screen flex relative'>
            <div className='flex-1 pt-28 px-6 md:px-9'>
                <div className='max-w-7xl mx-auto mb-12 flex flex-col lg:flex-row md:items-end justify-between gap-6'>
                    <div className='space-y-2'>
                        <div className='flex items-center gap-3 text-accent mb-2'>
                            <Newspaper className='size-6' />
                            <span className='text-sm font-semibold tracking-widest uppercase'>Explorar</span>
                        </div>
                        <h1 className='text-4xl md:text-5xl font-bold tracking-tight'>
                            Artículos
                        </h1>
                        <p className='text-muted-foreground text-lg max-w-2xl'>
                            Descubre investigaciones y relatos históricos detallados sobre la evolución de los centros y la cultura local.
                        </p>
                    </div>

                    <Link
                        href="/articles/new"
                        className='min-w-48 max-w-48 group inline-flex items-center gap-3 bg-accent text-accent-foreground font-bold px-6 py-3 rounded-md hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,237,0,0.3)] transition-all duration-300'
                    >
                        <Plus className='size-5 group-hover:rotate-90 transition-transform duration-300' />
                        Crear Artículo
                    </Link>
                </div>

                <div className='max-w-7xl mx-auto'>
                    {loading ? (
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className='space-y-4 rounded-2xl border border-white/5 p-5 bg-white/5'>
                                    <Skeleton className="h-6 w-3/4 rounded-lg bg-white/10" />
                                    <div className='space-y-2'>
                                        <Skeleton className="h-4 w-full rounded-lg bg-white/10" />
                                        <Skeleton className="h-4 w-full rounded-lg bg-white/10" />
                                        <Skeleton className="h-4 w-2/3 rounded-lg bg-white/10" />
                                    </div>
                                    <div className='flex justify-between items-center pt-4'>
                                        <Skeleton className="h-8 w-24 rounded-lg bg-white/10" />
                                        <Skeleton className="h-8 w-24 rounded-lg bg-white/10" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredArticles.length > 0 ? (
                        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8'>
                            {filteredArticles.map(article => (
                                <ArticleCard key={article.id} article={article} setIsModalOpen={setIsModalOpen} />
                            ))}
                        </div>
                    ) : (
                        <div className='flex flex-col items-center justify-center py-20 text-center space-y-4'>
                            <div className='size-20 rounded-full bg-white/5 flex items-center justify-center mb-4'>
                                <Search className='size-10 text-muted-foreground' />
                            </div>
                            <h2 className='text-2xl font-semibold'>No se encontraron artículos</h2>
                            <p className='text-muted-foreground max-w-sm'>
                                Intenta ajustar los términos de búsqueda o explora otras secciones.
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <div className='pt-22 pr-6 sticky top-0 h-full'>
                <Filters
                    filters={filters}
                    setFilters={setFilters}
                    setSelectedYearRange={setSelectedYearRange}
                    minYear={MIN_YEAR}
                    maxYear={MAX_YEAR}
                    dateFormat="AC/DC"
                />
            </div>
            <ArticleModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
            />
        </div>
    );
}
