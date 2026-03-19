"use client"

import { SchoolResponseObject } from "@/lib/interfaces/school.interface"
import { School, MapPin, Mail, Phone, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ConfirmationModal } from "@/components/shared/ConfirmationModal"

interface SchoolCardProps {
    school: SchoolResponseObject
    onEdit: (school: SchoolResponseObject) => void
    onDelete: (id: number) => void
}

export default function SchoolCard({ school, onEdit, onDelete }: SchoolCardProps) {
    return (
        <div className="group relative flex flex-col p-6 rounded-md border bg-linear-to-br from-primary to-primary/20 backdrop-blur-md hover:bg-primary/50 hover:border-muted hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-radial-[at_top_left] from-secondary/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <ConfirmationModal
                title="Eliminar Centro"
                action="Eliminar"
                description="¿Estás seguro de que quieres eliminar este centro? Esta acción no se puede deshacer."
                onConfirm={() => onDelete(school.id)}
            >
                <Button variant="ghost" size="icon" className="absolute top-3 right-3 h-8 w-8 border border-red-500/10 text-red-500/70 bg-red-500/10 rounded-sm hover:text-red-500 hover:bg-red-400/20 transition-colors z-10" title="Eliminar Centro">
                    <Trash2 className="size-4" />
                </Button>
            </ConfirmationModal>
            <div className="flex justify-between items-start mb-4 relative">
                <div className="flex items-start gap-3">
                    <div className="p-3 rounded-md bg-muted/50 text-accent border shadow-inner group-hover:scale-110 group-hover:bg-primary/80 transition-transform duration-300">
                        <School className="size-6" />
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-lg font-bold text-white line-clamp-2 leading-tight mb-1.5" title={school.name}>
                            {school.name}
                        </h3>
                        <div className="flex items-center justify-between gap-1 text-xs font-medium text-muted-foreground">
                            <span>Registrada el:</span>
                            <span>{new Date(school.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>

                </div>
            </div>

            <div className="space-y-3 mt-2 grow">
                <div className="flex items-center gap-3 text-sm text-white/80 group-hover:text-white transition-colors">
                    <MapPin className="size-4 shrink-0 text-muted-foreground group-hover:text-accent transition-colors" />
                    <span className="line-clamp-2">{school.address}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/80 group-hover:text-white transition-colors">
                    <Mail className="size-4 shrink-0 text-muted-foreground group-hover:text-accent transition-colors" />
                    <span className="truncate">{school.contact_mail}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/80 group-hover:text-white transition-colors">
                    <Phone className="size-4 shrink-0 text-muted-foreground group-hover:text-accent transition-colors" />
                    <span className="truncate">{school.contact_phone}</span>
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 transition-opacity mt-3 border-t pt-3">
                <Button variant="secondary" onClick={() => onEdit(school)} className="" title="Editar Centro">
                    <Edit className="size-4" /> Editar
                </Button>
            </div>
        </div>
    )
}
