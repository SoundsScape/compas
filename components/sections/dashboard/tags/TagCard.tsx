"use client"

import { Tag as TagIcon, Edit, Trash2, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tag } from "@/lib/interfaces/tag.interface"
import { ConfirmationModal } from "@/components/shared/ConfirmationModal"

interface TagCardProps {
    tag: Tag
    onEdit: (tag: Tag) => void
    onDelete: (id: number) => void
}

export default function TagCard({ tag, onEdit, onDelete }: TagCardProps) {
    console.log("tag", tag)
    return (
        <div className="group relative flex flex-col p-6 pl-3 rounded-md border-r-2 border-white/30 hover:border-accent bg-linear-to-r from-primary to-primary/10 hover:from-secondary backdrop-blur-md transition-all duration-300 overflow-hidden">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-primary/40 text-accent border border-primary/30 shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <TagIcon className="size-6" />
                </div>
                <div className="flex flex-col gap-1.5">
                    <h3 className="text-base font-bold text-white line-clamp-2 capitalize" title={tag.name}>
                        {tag.name}
                    </h3>
                    <p className="text-[12px] text-muted-foreground uppercase font-semibold">
                        {tag.articlesCount} Artículos asociados
                    </p>
                </div>
            </div>
            <div className="flex items-center justify-end gap-3 transition-opacity mt-4  pt-4">
                <ConfirmationModal
                    title="Eliminar Etiqueta"
                    action="Eliminar"
                    description="¿Estás seguro de que quieres eliminar esta etiqueta? Esta acción no se puede deshacer."
                    onConfirm={() => onDelete(tag.id)}
                >
                    <Button variant="ghost" size="sm" className="border border-red-500/40 text-red-500/90 bg-red-500/10 rounded-sm hover:text-red-500 hover:bg-red-400/20 transition-colors z-10" title="Eliminar Etiqueta">
                        <Trash2 className="size-4" /> Eliminar
                    </Button>
                </ConfirmationModal>
                <Button variant="secondary" size="sm" onClick={() => onEdit(tag)} className="" title="Editar Etiqueta">
                    <Edit className="size-4" /> Editar
                </Button>
            </div>
        </div>
    )
}
