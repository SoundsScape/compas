"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Save } from "lucide-react"
import { createRole, updateRole } from "@/lib/services/roleService"

export interface RoleData {
    id: number;
    role_name: string;
    description: string;
    created_at?: string;
}

interface RoleModalProps {
    isOpen: boolean
    onClose: () => void
    role: RoleData | null
    onSuccess: () => void
}

export default function RoleModal({ isOpen, onClose, role, onSuccess }: RoleModalProps) {
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        role_name: "",
        description: ""
    })

    useEffect(() => {
        if (isOpen) {
            if (role) {
                setFormData({
                    role_name: role.role_name || "",
                    description: role.description || ""
                })
            } else {
                setFormData({
                    role_name: "",
                    description: ""
                })
            }
        }
    }, [isOpen, role])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            if (role) {
                await updateRole(role.id, formData)
            } else {
                await createRole(formData)
            }
            onSuccess()
            onClose()
        } catch (error) {
            console.error("Error saving role:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md backdrop-blur-xl border-white/10 text-white bg-background/80">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-white/60">
                        {role ? "Editar Rol" : "Crear Nuevo Rol"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="role_name">Nombre del Rol</Label>
                            <Input
                                id="role_name"
                                value={formData.role_name}
                                onChange={(e) => handleChange("role_name", e.target.value)}
                                className="bg-white/5 border-white/10 focus:border-accent/50"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Descripción</Label>
                            <Input
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleChange("description", e.target.value)}
                                className="bg-white/5 border-white/10 focus:border-accent/50"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="bg-white/5 hover:bg-white/10"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-accent text-accent-foreground min-w-[120px]"
                        >
                            {loading ? (
                                <Loader2 className="size-4 animate-spin mr-2" />
                            ) : (
                                <Save className="size-4 mr-2" />
                            )}
                            Guardar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
