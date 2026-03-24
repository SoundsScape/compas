"use client"

import { useState, useEffect, useMemo } from "react"
import { StatsCard } from "@/components/sections/dashboard/StatsCard"
import TagCard from "@/components/sections/dashboard/tags/TagCard"
import TagModal from "@/components/sections/dashboard/tags/TagModal"
import { Button } from "@/components/ui/button"
import { Tag as TagIcon, Plus, Loader2 } from "lucide-react"
import { getTags, deleteTag } from "@/lib/services/tagService"
import { Tag } from "@/lib/interfaces/tag.interface"
import DashboardPagination from "@/components/shared/Pagination"
import { toast } from "sonner"
import DashboardHeader from "@/components/sections/dashboard/DashboardHeader"

export default function TagsDashboardPage() {
    const [tags, setTags] = useState<Tag[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const [limit] = useState(16) // Tags are smaller, we can fit more (4x4)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedTag, setSelectedTag] = useState<Tag | null>(null)

    const fetchTags = async () => {
        setLoading(true)
        try {
            const res = await getTags()
            const data = (res as any).data || res;
            if (Array.isArray(data)) {
                setTags(data)
                setTotalItems(data.length)
            }
        } catch (error) {
            console.error("Error fetching tags:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTags()
    }, [])

    const handleCreate = () => {
        setSelectedTag(null)
        setIsModalOpen(true)
    }

    const handleEdit = (tag: Tag) => {
        setSelectedTag(tag)
        setIsModalOpen(true)
    }

    const handleDelete = async (id: number) => {

        try {
            await deleteTag(id)
            fetchTags()
        } catch (error) {
            console.error("Error al eliminar la etiqueta", error)
            toast.error("Error al eliminar la etiqueta")
        } finally {
            setLoading(false)
            toast.success("Etiqueta eliminada correctamente")
        }

    }

    const mappedTags = useMemo(() => {
        return tags.slice((currentPage - 1) * limit, currentPage * limit)
    }, [tags, currentPage, limit])

    if (loading && tags.length === 0) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="size-8 animate-spin text-accent" />
            </div>
        )
    }

    const totalPages = Math.ceil(totalItems / limit)

    return (
        <div className="flex flex-col gap-9 min-w-0">

            <div className="flex flex-col justify-between items-start gap-8">
                <DashboardHeader
                    title="Etiquetas"
                    description="Gestiona las etiquetas de tus artículos"
                />
                <Button
                    onClick={handleCreate}
                >
                    <Plus className="size-5" />
                    Crear Etiqueta
                </Button>
                {totalItems > limit && (
                    <DashboardPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                )}
            </div>

            {loading ? (
                <div className="flex h-[30vh] items-center justify-center w-full">
                    <Loader2 className="size-8 animate-spin text-primary" />
                </div>
            ) : mappedTags.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {mappedTags.map(tag => (
                        <TagCard
                            key={tag.id}
                            tag={tag}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col h-[30vh] items-center justify-center w-full border-2 border-dashed border-white/10 rounded-md bg-background/20">
                    <TagIcon className="size-12 text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-xl font-bold text-white/50">No hay etiquetas registradas</h3>
                    <p className="text-sm text-muted-foreground mt-2">Haz clic en Crear Etiqueta para añadir la primera.</p>
                </div>
            )}

            <TagModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                tag={selectedTag}
                onSuccess={fetchTags}
            />
        </div>
    )
}
