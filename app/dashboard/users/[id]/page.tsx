"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Mail, Shield, School, Calendar, User as UserIcon, FileText, Loader2, ExternalLink, CheckCircle2, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getUserById } from "@/lib/services/userService"
import { getUserArticles } from "@/lib/services/articleService"
import { User } from "@/lib/interfaces/user.interface"
import { Article } from "@/lib/interfaces/article.interface"
import ArticleModal from "@/components/shared/articles/ArticleModal"
import { StatsCard } from "@/components/sections/dashboard/StatsCard"

export default function UserProfilePage() {
    const params = useParams()
    const router = useRouter()
    const userId = params.id as string

    const [user, setUser] = useState<User | null>(null)
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingArticles, setLoadingArticles] = useState(false)
    const [stats, setStats] = useState({ total: 0, validated: 0 })
    const [isArticleModalOpen, setIsArticleModalOpen] = useState(false)

    useEffect(() => {
        if (userId) {
            fetchUserData()
        }
    }, [userId])

    const fetchUserData = async () => {
        setLoading(true)
        try {
            const userData = await getUserById(Number(userId))
            setUser(userData)
            await fetchUserArticles(Number(userId))
        } catch (error) {
            console.error("Error fetching user data:", error)
        } finally {
            setLoading(false)
        }
    }

    const fetchUserArticles = async (id: number) => {
        setLoadingArticles(true)
        try {
            const res = await getUserArticles(id, 1, 50)
            setArticles(res.data)
            setStats({
                total: res.meta.total,
                validated: res.meta.validatedCount || 0
            })
        } catch (error) {
            console.error("Error fetching user articles:", error)
        } finally {
            setLoadingArticles(false)
        }
    }

    const handleViewArticle = (articleId: number) => {
        sessionStorage.setItem('articleId', articleId.toString())
        setIsArticleModalOpen(true)
    }

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="size-8 animate-spin text-accent" />
            </div>
        )
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <p className="text-xl font-semibold text-muted-foreground">Usuario no encontrado</p>
                <Button onClick={() => router.push('/dashboard/users')} variant="outline">
                    Volver a la lista
                </Button>
            </div>
        )
    }

    const initials = `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase()

    return (
        <div className="w-full mx-auto space-y-6 animate-in fade-in duration-500">

            <div className="flex items-center justify-between">
                <Button
                    variant="link"
                    onClick={() => router.push('/dashboard/users')}
                    className="group flex items-center gap-2 text-foreground hover:text-accent transition-colors"
                >
                    <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                    Volver a Usuarios
                </Button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 font-sans tracking-wider">

                <div className="col-span-1 xl:col-span-2 flex flex-col sm:flex-row items-center gap-6 p-6 md:p-8 bg-background/40 backdrop-blur-xl border rounded-lg relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-100"></div>
                    <div className="relative group/avatar shrink-0">
                        <div className="absolute -inset-2 bg-linear-to-r from-accent to-accent-foreground rounded-full blur opacity-25 group-hover/avatar:opacity-60 transition duration-1000 group-hover/avatar:duration-300"></div>
                        <div className="relative flex items-center justify-center size-24 md:size-32 rounded-full bg-background/80 backdrop-blur-md border text-4xl md:text-5xl font-bold text-accent shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden">
                            {user.image_path ? (
                                <img src={user.image_path} alt={user.username} className="size-full object-cover transition-transform duration-500 group-hover/avatar:scale-110" />
                            ) : (
                                initials || <UserIcon className="size-16" />
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row w-full justify-between items-center sm:items-start gap-4 z-10 pt-2">
                        <div className="space-y-1 text-center sm:text-left">
                            <h1 className="text-3xl md:text-4xl font-semibold text-white">
                                {user.first_name} {user.last_name}
                            </h1>
                            <p className="text-lg text-muted-foreground/80 font-medium">@{user.username}</p>
                        </div>

                        <Badge className={`px-5 py-1.5 text-sm font-bold border shadow-lg backdrop-blur-md uppercase tracking-wider ${(typeof user.status === 'string' ? user.status : user.status?.status_name) === 'activo'
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                            }`}>
                            {(typeof user.status === 'string' ? user.status : user.status?.status_name || "N/A")}
                        </Badge>
                    </div>
                </div>

                <div className="col-span-1 h-fit xl:col-span-2 bg-background/40 backdrop-blur-md rounded-md overflow-hidden border shadow-lg flex-1">
                    <div className="px-6 py-4 border-b bg-linear-to-b from-primary via-background to-primary">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Shield className="size-5 text-accent" />
                            Información
                        </h2>
                    </div>
                    <div className="flex flex-col md:flex-row gap-6 md:gap-12 p-6">
                        <div className="flex flex-col gap-4">
                            <InfoItem
                                icon={Mail}
                                label="Correo Electrónico"
                                value={user.email}
                            />
                            <InfoItem
                                icon={Shield}
                                label="Rol Asignado"
                                value={typeof user.role === 'string' ? user.role : user.role?.role_name || "N/A"}
                            />
                        </div>
                        <div className="flex flex-col gap-4">
                            <InfoItem
                                icon={School}
                                label="Centro Educativo"
                                value={typeof user.school === 'string' ? user.school : user.school?.name || "N/A"}
                            />
                            <InfoItem
                                icon={Calendar}
                                label="Miembro desde"
                                value={user.created_at ? new Date(user.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : "N/A"}
                            />
                        </div>
                    </div>
                </div>

                <div className="col-span-1 xl:col-span-4 bg-background/40 backdrop-blur-md rounded-md overflow-hidden border shadow-xl flex flex-col ">
                    <div className="px-6 py-4 border-b bg-linear-to-b from-primary via-background to-primary flex items-center justify-between">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <FileText className="size-5 text-secondary" />
                            Publicaciones
                        </h2>
                        {articles.length > 0 && (
                            <Badge variant="outline" className="border bg-black/50 text-muted-foreground">
                                {articles.length} en total
                            </Badge>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                            <StatsCard
                                title="Artículos"
                                value={stats.total}
                                icon={FileText}
                            />
                            <StatsCard
                                title="Validados"
                                value={stats.validated}
                                icon={CheckCircle2}
                            />
                        </div>

                        <div className="col-span-3 flex-1 relative">
                            {loadingArticles ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40">
                                    <Loader2 className="size-10 animate-spin mb-4 text-primary" />
                                    <p className="text-sm font-medium tracking-wide">Cargando repositorio...</p>
                                </div>
                            ) : articles.length > 0 ? (
                                <div className="grid grid-cols-1 gap-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                                    {articles.map((article) => (
                                        <div
                                            key={article.id.toString()}
                                            className="group relative flex items-center justify-between p-4 rounded-md border bg-black/20 hover:bg-muted/20 hover:border-white/10 hover:shadow-lg transition-all duration-300"
                                        >
                                            <div className="flex flex-col overflow-hidden w-full pr-4">
                                                <p className="text-base font-semibold text-white/90 group-hover:text-white transition-colors truncate">
                                                    {article.titulo}
                                                </p>
                                                <p className="text-xs text-muted-foreground/60 font-medium mt-1 uppercase tracking-wider">
                                                    {new Date(article.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3 shrink-0">
                                                <Badge
                                                    className={article.validated === true
                                                        ? "border-green-500/20 bg-green-500/10 text-green-400 hover:bg-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]"
                                                        : "border-yellow-500/20 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.1)]"
                                                    }
                                                >
                                                    {article.validated ? "Validado" : "Pendiente"}
                                                </Badge>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleViewArticle(Number(article.id))}
                                                    className="h-8 w-8 p-0 rounded-md text-secondary hover:text-white hover:bg-secondary/40 transition-all opacity-70 group-hover:opacity-100"
                                                    title="Ver artículo"
                                                >
                                                    <ExternalLink className="size-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20 border-2 border-dashed rounded-xl m-6">
                                    <FileText className="size-16 mb-4 opacity-30" />
                                    <p className="text-xl font-bold text-white/40">Sin publicaciones</p>
                                    <p className="text-sm text-white/30 text-center max-w-xs mt-2">
                                        Este usuario no tiene artículos registrados en el sistema.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            <ArticleModal
                isModalOpen={isArticleModalOpen}
                setIsModalOpen={setIsArticleModalOpen}
            />
        </div>
    )
}

function InfoItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="space-y-2 group flex items-center gap-3">
            <div className="p-2 rounded-sm bg-secondary/70 group-hover:text-accent transition-colors">
                <Icon className="size-5" />
            </div>
            <div className="flex flex-col gap-0.5">
                <span className="tracking-wider font-semibold">{label}</span>
                <p className="inline-block pt-0.5 pb-1 rounded-sm text-md text-muted-foreground/80">
                    {value}
                </p>
            </div>
        </div>
    )
}
