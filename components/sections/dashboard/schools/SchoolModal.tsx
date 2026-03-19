"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Save } from "lucide-react"
import { createSchool, updateSchool } from "@/lib/services/schoolService"
import { SchoolResponseObject } from "@/lib/interfaces/school.interface"
import { toast } from "sonner"

interface SchoolModalProps {
    isOpen: boolean
    onClose: () => void
    school: SchoolResponseObject | null
    onSuccess: () => void
}

export default function SchoolModal({ isOpen, onClose, school, onSuccess }: SchoolModalProps) {
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        address: "",
        contact_mail: "",
        contact_phone: ""
    })

    useEffect(() => {
        if (isOpen) {
            if (school) {
                setFormData({
                    name: school.name || "",
                    address: school.address || "",
                    contact_mail: school.contact_mail || "",
                    contact_phone: school.contact_phone || ""
                })
            } else {
                setFormData({
                    name: "",
                    address: "",
                    contact_mail: "",
                    contact_phone: ""
                })
            }
        }
    }, [isOpen, school])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            if (school) {
                await updateSchool(school.id, formData)
            } else {
                await createSchool(formData)
            }
            onSuccess()
            onClose()
        } catch (error) {
            console.error("Error saving school:", error)
            toast.error("Error al guardar el centro")
        } finally {
            setLoading(false)
            toast.success("Centro guardado correctamente")
        }
    }

    const handleChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-xl ">
                <DialogHeader>
                    <DialogTitle>
                        {school ? "Editar Escuela" : "Crear Nueva Escuela"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-full">
                            <Label htmlFor="name">Nombre del Centro</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                className="bg-white/5 border-white/10 focus:border-accent/50"
                                required
                            />
                        </div>
                        <div className="space-y-2 col-span-full">
                            <Label htmlFor="address">Dirección</Label>
                            <Input
                                id="address"
                                value={formData.address}
                                onChange={(e) => handleChange("address", e.target.value)}
                                className="bg-white/5 border-white/10"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contact_mail">Correo de Contacto</Label>
                            <Input
                                id="contact_mail"
                                type="email"
                                value={formData.contact_mail}
                                onChange={(e) => handleChange("contact_mail", e.target.value)}
                                className="bg-white/5 border-white/10"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contact_phone">Teléfono de Contacto</Label>
                            <Input
                                id="contact_phone"
                                type="tel"
                                value={formData.contact_phone}
                                onChange={(e) => handleChange("contact_phone", e.target.value)}
                                className="bg-white/5 border-white/10"
                                required
                            />
                        </div>
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
