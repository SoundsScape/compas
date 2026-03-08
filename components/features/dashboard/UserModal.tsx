"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getStatuses } from "@/lib/services/dashboardService"
import { Loader2, Save, X } from "lucide-react"
import { getSchools } from "@/lib/services/schoolService"
import { getRoles } from "@/lib/services/roleService"
import { createUser, updateUser } from "@/lib/services/userService"

interface UserModalProps {
    isOpen: boolean
    onClose: () => void
    user: any | null
    onSuccess: () => void
}

export default function UserModal({ isOpen, onClose, user, onSuccess }: UserModalProps) {
    const [loading, setLoading] = useState(false)
    const [schools, setSchools] = useState<any[]>([])
    const [roles, setRoles] = useState<any[]>([])
    const [statuses, setStatuses] = useState<any[]>([])

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        password: "",
        roles_id: "",
        statuses_id: "",
        school_id: ""
    })

    useEffect(() => {
        if (isOpen) {
            fetchData()
            if (user) {
                setFormData({
                    username: user.username || "",
                    email: user.email || "",
                    first_name: user.first_name || "",
                    last_name: user.last_name || "",
                    password: "", // No editamos password aquí usualmente
                    roles_id: user.roles_id?.toString() || "",
                    statuses_id: user.statuses_id?.toString() || "",
                    school_id: user.school_id?.toString() || ""
                })
            } else {
                setFormData({
                    username: "",
                    email: "",
                    first_name: "",
                    last_name: "",
                    password: "",
                    roles_id: "",
                    statuses_id: "",
                    school_id: ""
                })
            }
        }
    }, [isOpen, user])

    const fetchData = async () => {
        try {
            const [schoolsRes, rolesRes, statusesRes] = await Promise.all([
                getSchools(),
                getRoles(),
                getStatuses()
            ])
            setSchools(schoolsRes.data || []) // Asumiendo estructura paginada { data, meta }
            setRoles(rolesRes.data || [])
            setStatuses(statusesRes.data || [])
        } catch (error) {
            console.error("Error fetching modal data:", error)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { roles_id, statuses_id, school_id, password, ...rest } = formData;

            const submissionData: any = {
                ...rest,
                roles_id: roles_id ? parseInt(roles_id) : undefined,
                statuses_id: statuses_id ? parseInt(statuses_id) : undefined,
                school_id: school_id ? parseInt(school_id) : null,
            }

            if (password && password.trim() !== "") {
                submissionData.password = password;
            }

            if (user) {
                await updateUser(user.id, submissionData)
            } else {
                await createUser(submissionData)
            }
            onSuccess()
            onClose()
        } catch (error) {
            console.error("Error saving user:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl bg-background/95 backdrop-blur-xl border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-white/60">
                        {user ? "Editar Usuario" : "Crear Nuevo Usuario"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Nombre de Usuario</Label>
                            <Input
                                id="username"
                                value={formData.username}
                                onChange={(e) => handleChange("username", e.target.value)}
                                className="bg-white/5 border-white/10 focus:border-accent/50"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                className="bg-white/5 border-white/10 focus:border-accent/50"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="first_name">Nombre</Label>
                            <Input
                                id="first_name"
                                value={formData.first_name}
                                onChange={(e) => handleChange("first_name", e.target.value)}
                                className="bg-white/5 border-white/10 focus:border-accent/50"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last_name">Apellido</Label>
                            <Input
                                id="last_name"
                                value={formData.last_name}
                                onChange={(e) => handleChange("last_name", e.target.value)}
                                className="bg-white/5 border-white/10 focus:border-accent/50"
                            />
                        </div>

                        {!user && (
                            <div className="space-y-2 col-span-full">
                                <Label htmlFor="password">Contraseña</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => handleChange("password", e.target.value)}
                                    className="bg-white/5 border-white/10 focus:border-accent/50"
                                    required={!user}
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="school">Centro Educativo</Label>
                            <Select
                                value={formData.school_id}
                                onValueChange={(val: string) => handleChange("school_id", val)}
                            >
                                <SelectTrigger className="bg-white/5 border-white/10">
                                    <SelectValue placeholder="Selecciona un centro" />
                                </SelectTrigger>
                                <SelectContent className="bg-background/95 backdrop-blur-xl border-white/10">
                                    {schools.map((s) => (
                                        <SelectItem key={s.id} value={s.id.toString()}>
                                            {s.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Rol</Label>
                            <Select
                                value={formData.roles_id}
                                onValueChange={(val: string) => handleChange("roles_id", val)}
                                required
                            >
                                <SelectTrigger className="bg-white/5 border-white/10">
                                    <SelectValue placeholder="Selecciona un rol" />
                                </SelectTrigger>
                                <SelectContent className="bg-background/95 backdrop-blur-xl border-white/10">
                                    {roles.map((r) => (
                                        <SelectItem key={r.id} value={r.id.toString()}>
                                            {r.role_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Estatus</Label>
                            <Select
                                value={formData.statuses_id}
                                onValueChange={(val: string) => handleChange("statuses_id", val)}
                                required
                            >
                                <SelectTrigger className="bg-white/5 border-white/10">
                                    <SelectValue placeholder="Selecciona un estatus" />
                                </SelectTrigger>
                                <SelectContent className="bg-background/95 backdrop-blur-xl border-white/10">
                                    {statuses.map((s) => (
                                        <SelectItem key={s.id} value={s.id.toString()}>
                                            {s.status_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
