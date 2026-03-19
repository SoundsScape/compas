"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Save } from "lucide-react"
import { postTag as createTag, updateTag } from "@/lib/services/tagService"
import { Tag } from "@/lib/interfaces/tag.interface"
import { toast } from "sonner"

interface TagModalProps {
    isOpen: boolean
    onClose: () => void
    tag: Tag | null
    onSuccess: () => void
}

export default function TagModal({ isOpen, onClose, tag, onSuccess }: TagModalProps) {
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        name: ""
    })

    useEffect(() => {
        if (isOpen) {
            if (tag) {
                setFormData({
                    name: tag.name || ""
                })
            } else {
                setFormData({
                    name: ""
                })
            }
        }
    }, [isOpen, tag])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            if (tag) {
                await updateTag(tag.id, formData)
            } else {
                await createTag(formData)
            }
            onSuccess()
            onClose()
            toast.success("Etiqueta guardada correctamente")
        } catch (error) {
            console.error("Error saving tag:", error)
            toast.error("Error al guardar la etiqueta")
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-sm backdrop-blur-xl border-white/10 text-white bg-background/80">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-white/60">
                        {tag ? "Editar Etiqueta" : "Crear Nueva Etiqueta"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre de la Etiqueta</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            className="bg-white/5 border-white/10 focus:border-accent/50"
                            placeholder="Ej: Innovación, Diseño..."
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                        <Button
                            type="button"
                            variant="cancel"
                            onClick={onClose}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <Save className="size-4" />
                            )}
                            Guardar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
