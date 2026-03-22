"use client";

import { useState, useEffect } from 'react';
import ArticleCard from '@/components/sections/articles/ArticleCard';
import { Plus, Search, Newspaper } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import ArticleModal from '@/components/shared/articles/ArticleModal';
import Filters from '@/components/sections/home/Filters';
import { useArticles } from '@/lib/hooks/useArticles';
import DashboardPagination from '@/components/shared/Pagination';

const MIN_YEAR = -35000;
const MAX_YEAR = new Date().getFullYear();

export default function ArticlesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 9;

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

    const { articles: filteredArticles, loading } = useArticles(filters);

    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
    const paginatedArticles = filteredArticles.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className='min-h-screen flex relative'>
            <div className='flex-1 pt-28 px-6 md:px-6'>
                <div className='max-w-7xl mx-auto mb-6 lg:mb-9 flex flex-col lg:flex-row md:items-end justify-between gap-6'>
                    <div className='space-y-2 w-full'>
                        <div className='flex items-center gap-3 text-accent mb-2'>
                            <Newspaper className='size-6' />
                            <span className='text-sm font-semibold tracking-widest uppercase'>Explorar</span>
                        </div>
                        <h1 className='text-4xl md:text-5xl font-bold tracking-tight'>
                            Artículos
                        </h1>
                        <p className='text-muted-foreground text-md max-w-xl tracking-normal'>
                            Descubre investigaciones y relatos históricos detallados sobre la evolución de la música y la cultura local.
                        </p>
                    </div>

                    <div className=''>
                        <Link
                            href="/articles/new"
                            className='group inline-flex items-center justify-center gap-2 w-44 bg-accent text-accent-foreground font-bold px-3 py-2 rounded-sm hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,237,0,0.3)] transition-all duration-300'
                        >
                            <Plus className='size-5 group-hover:rotate-90 transition-transform duration-300' />
                            Crear Artículo
                        </Link>
                    </div>
                </div>

                <div className='max-w-7xl mx-auto'>
                    {loading ? (
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-9'>
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className='space-y-4 rounded-md border border-white/5 p-9 bg-white/5'>
                                    <Skeleton className="h-7 w-3/4 rounded-md bg-white/10" />
                                    <div className='flex items-center gap-2 mb-6'>
                                        <Skeleton className="h-6 w-1/3 rounded-full bg-white/10" />
                                        <Skeleton className="h-6 w-1/3 rounded-md bg-white/10" />
                                    </div>
                                    <div className='space-y-2 mb-6'>
                                        <Skeleton className="h-4 w-full rounded-md bg-white/10" />
                                        <Skeleton className="h-4 w-full rounded-md bg-white/10" />
                                        <Skeleton className="h-4 w-3/4 rounded-md bg-white/10" />
                                        <Skeleton className="h-4 w-2/3 rounded-md bg-white/10" />
                                    </div>
                                    <div className='flex justify-between items-center pt-4'>
                                        <Skeleton className="h-8 w-24 rounded-md bg-white/10" />
                                        <Skeleton className="h-8 w-24 rounded-md bg-white/10" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredArticles.length > 0 ? (
                        <div className='space-y-12 pb-12'>
                            <div className='grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-3 lg:gap-5'>
                                {paginatedArticles.map(article => (
                                    <ArticleCard key={article.id} article={article} setIsModalOpen={setIsModalOpen} />
                                ))}
                            </div>
                            
                            {totalPages > 1 && (
                                <div className='flex justify-center'>
                                    <DashboardPagination 
                                        currentPage={currentPage} 
                                        totalPages={totalPages} 
                                        onPageChange={(page) => {
                                            setCurrentPage(page);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }} 
                                    />
                                </div>
                            )}
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
