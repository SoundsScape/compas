"use client"

import { useState, useEffect, useMemo } from "react"
import { StatsCard } from "@/components/sections/dashboard/StatsCard"
import { ArticlesTable } from "@/components/sections/dashboard/ArticlesTable"
import { Button } from "@/components/ui/button"
import { FileText, CheckCircle2, Clock, Plus, Loader2 } from "lucide-react"
import { getDashboardArticles } from "@/lib/services/articleService"
import { Article } from "@/lib/interfaces/article.interface"
import DashboardPagination from "@/components/shared/Pagination"
import ArticleModal from "@/components/shared/articles/ArticleModal"
import Link from "next/link"

export default function ArticlesPage() {
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const [limit] = useState(10) // Items per page
    const [stats, setStats] = useState({ total: 0, validated: 0, pending: 0 })
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchArticles = async (page: number) => {
        setLoading(true)
        try {
            const response = await getDashboardArticles(page, limit)
            if (response && response.data) {
                setArticles(response.data)
                setTotalItems(response.meta?.total || 0)
                setStats({
                    total: response.meta?.total || 0,
                    validated: response.meta?.validatedCount || 0,
                    pending: response.meta?.pendingCount || 0
                })
            }
        } catch (error) {
            console.error("Error fetching articles:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchArticles(currentPage)
    }, [currentPage])

    // Map articles for table
    const mappedArticles = useMemo(() => {
        return articles.map(art => ({
            id: art.id,
            title: art.titulo,
            author: `${art.nombre_autor} ${art.apellidos_autor || ""}`.trim(),
            school: art.centro || "N/A",
            status: art.validated ? "Validado" : "Pendiente",
            date: art.fecha.toString()
        }))
    }, [articles])

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="size-8 animate-spin text-accent" />
            </div>
        )
    }

    const totalPages = Math.ceil(totalItems / limit);

    return (
        <div className="flex flex-col gap-9 min-w-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatsCard
                    title="Total de Artículos"
                    value={stats.total}
                    icon={FileText}
                />
                <StatsCard
                    title="Artículos Validados"
                    value={stats.validated}
                    icon={CheckCircle2}
                />
                <StatsCard
                    title="Pendientes de Validación"
                    value={stats.pending}
                    icon={Clock}
                />
            </div>
            <div className="flex justify-between items-center">
                <Link href="/articles/new" className='inline-flex items-center gap-2 bg-accent text-accent-foreground font-medium px-4 py-2 rounded-md'>
                    <Plus className="size-5" />
                    Crear Artículo
                </Link>
                {totalItems > 0 && (
                    <DashboardPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                )}
            </div>
            <div className="min-w-0">
                <ArticlesTable articles={mappedArticles} setIsModalOpen={setIsModalOpen} onDeleteSuccess={() => fetchArticles(currentPage)} />
            </div>
            <ArticleModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
            />
        </div>
    )
}
