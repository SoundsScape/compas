"use client"

import { useState, useEffect, useMemo } from "react"
import { StatsCard } from "@/components/sections/dashboard/StatsCard"
import { ArticlesTable } from "@/components/sections/dashboard/articles/ArticlesTable"
import { FileText, CheckCircle2, Clock, Plus, Loader2 } from "lucide-react"
import { getDashboardArticles } from "@/lib/services/articleService"
import { Article } from "@/lib/interfaces/article.interface"
import DashboardPagination from "@/components/shared/Pagination"
import ArticleModal from "@/components/shared/articles/ArticleModal"
import Link from "next/link"
import DashboardHeader from "@/components/sections/dashboard/DashboardHeader"

export default function ArticlesPage() {
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const [limit] = useState(10) // Items per page
    const [stats, setStats] = useState({ total: 0, validated: 0, pending: 0 })
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userRole, setUserRole] = useState<string>("");

    const [isFirstLoad, setIsFirstLoad] = useState(true);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                const r_name = (
                    user.role ||
                    user.role_name ||
                    user.roles?.role_name ||
                    ""
                ).toLowerCase();

                if (r_name === 'student') {
                    setUserRole("student");
                } else if (r_name === 'teacher') {
                    setUserRole("teacher");
                } else if (r_name === 'admin' || r_name === 'superadmin') {
                    setUserRole("admin");
                } else {
                    const r_id = Number(user.roles_id);
                    if (r_id === 3) setUserRole("student");
                    else if (r_id === 4) setUserRole("teacher");
                    else if (r_id === 1 || r_id === 2) setUserRole("admin");
                    else setUserRole(r_name || "user");
                }
            } catch (e) {
                console.error("Error parsing user data", e);
            }
        }
    }, []);

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
            setIsFirstLoad(false)
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

    if (loading && isFirstLoad) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="size-8 animate-spin text-accent" />
            </div>
        )
    }

    const totalPages = Math.ceil(totalItems / limit);

    return (
        <div className="flex flex-col gap-6 xl:gap-8 min-w-0 bg-radial to-75% from-primary to-background relative">
            <div className="flex flex-col gap-3 xl:gap-8">
                <DashboardHeader
                    title="Todos los Artículos"
                    description="Aquí puedes ver todos los artículos registrados en el sistema."
                />

                <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
                    <StatsCard
                        title="Total"
                        value={stats.total}
                        icon={FileText}
                    />
                    <StatsCard
                        title="Validados"
                        value={stats.validated}
                        icon={CheckCircle2}
                    />
                    <StatsCard
                        title="Pendientes"
                        value={stats.pending}
                        icon={Clock}
                    />
                </div>
            </div>
            <div className="flex justify-between items-center">
                <Link href="/articles/new"
                    className='group inline-flex items-center justify-center gap-2 w-44 bg-accent text-accent-foreground font-medium px-3 py-2 rounded-sm hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,237,0,0.3)] transition-all duration-300'
                >
                    <Plus className='size-5 group-hover:rotate-90 transition-transform duration-300' />
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
                <ArticlesTable
                    articles={mappedArticles}
                    setIsModalOpen={setIsModalOpen}
                    onDeleteSuccess={() => fetchArticles(currentPage)}
                    userRole={userRole}
                    isLoading={loading}
                />
            </div>
            <ArticleModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
            />
        </div>
    )
}
