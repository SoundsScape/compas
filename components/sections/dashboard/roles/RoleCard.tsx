"use client"

import { Shield, Edit, Trash2, MoreVertical, Info } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { RoleData } from "./RoleModal"
import { ConfirmationModal } from "@/components/shared/ConfirmationModal"

interface RoleCardProps {
    role: RoleData
    onEdit: (role: RoleData) => void
    onDelete: (id: number) => void
}

export default function RoleCard({ role, onEdit, onDelete }: RoleCardProps) {
    return (
        <div className="group relative flex flex-col p-6 rounded-md border border-l-6 border-muted hover:border-secondary bg-linear-to-l from-primary to-primary/20 backdrop-blur-md hover:bg-primary/50 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-radial-[at_top_right] from-secondary/60 via-transparent to-transparent hover:border-accent border opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-md bg-muted/50 text-accent border shadow-inner group-hover:scale-110 group-hover:bg-primary/80 transition-transform duration-300">
                        <Shield className="size-6" />
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-lg font-bold text-white line-clamp-1 capitalize" title={role.role_name}>
                            {role.role_name}
                        </h3>
                    </div>
                </div>
            </div>

            <div className="space-y-3 mt-2 grow">
                <div className="flex items-start gap-3 text-sm text-white/80 group-hover:text-white transition-colors">
                    <Info className="size-4 shrink-0 mt-0.5 text-muted-foreground group-hover:text-accent transition-colors" />
                    <span className="line-clamp-3">{role.description}</span>
                </div>
            </div>

            {role.created_at && (
                <div className="mt-3 flex items-center justify-between text-xs font-medium text-muted-foreground">
                    <span>Creado el:</span>
                    <span>{new Date(role.created_at).toLocaleDateString()}</span>
                </div>
            )}

            <div className="flex items-center justify-end gap-3 transition-opacity mt-4 border-t pt-4">
                <ConfirmationModal
                    title="Eliminar Rol"
                    action="Eliminar"
                    description="¿Estás seguro de que quieres eliminar este rol? Esta acción no se puede deshacer."
                    onConfirm={() => onDelete(role.id)}
                >
                    <Button variant="ghost" size="sm" className="border border-red-500/40 text-red-500/90 bg-red-500/10 rounded-sm hover:text-red-500 hover:bg-red-400/20 transition-colors z-10" title="Eliminar Rol">
                        <Trash2 className="size-4" /> Eliminar
                    </Button>
                </ConfirmationModal>
                <Button variant="secondary" size="sm" onClick={() => onEdit(role)} className="" title="Editar Rol">
                    <Edit className="size-4" /> Editar
                </Button>
            </div>
        </div>
    )
}
