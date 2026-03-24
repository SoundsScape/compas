"use client"

import { useState, useEffect, useMemo } from "react"
import RoleCard from "@/components/sections/dashboard/roles/RoleCard"
import RoleModal, { RoleData } from "@/components/sections/dashboard/roles/RoleModal"
import { Button } from "@/components/ui/button"
import { Shield, Plus, Loader2 } from "lucide-react"
import { getRoles, deleteRole } from "@/lib/services/roleService"
import DashboardPagination from "@/components/shared/Pagination"
import DashboardHeader from "@/components/sections/dashboard/DashboardHeader"

export default function RolesDashboardPage() {
    const [roles, setRoles] = useState<RoleData[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const [limit] = useState(12)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedRole, setSelectedRole] = useState<RoleData | null>(null)

    const fetchRoles = async () => {
        setLoading(true)
        try {
            const res = await getRoles()
            const data = res.data || res;
            if (Array.isArray(data)) {
                setRoles(data)
                setTotalItems(data.length)
            }
        } catch (error) {
            console.error("Error fetching roles:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRoles()
    }, [])

    const handleCreate = () => {
        setSelectedRole(null)
        setIsModalOpen(true)
    }

    const handleEdit = (role: RoleData) => {
        setSelectedRole(role)
        setIsModalOpen(true)
    }

    const handleDelete = async (id: number) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este rol? Al no ser reasignado, podría causar errores en los usuarios existentes.")) {
            setLoading(true)
            try {
                await deleteRole(id)
                fetchRoles()
            } catch (error) {
                console.error("Error al eliminar el rol", error)
                setLoading(false)
            }
        }
    }

    const stats = useMemo(() => {
        return {
            total: roles.length
        }
    }, [roles])

    const mappedRoles = useMemo(() => {
        return roles.slice((currentPage - 1) * limit, currentPage * limit)
    }, [roles, currentPage, limit])

    if (loading && roles.length === 0) {
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
                    title="Roles"
                    description="Gestiona los roles de tus usuarios"
                />
                <Button onClick={handleCreate}>
                    <Plus className="size-5" />
                    Crear Rol
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
                <div className="flex h-[30vh] items-center justify-center w-full bg-background/20 rounded-xl">
                    <Loader2 className="size-8 animate-spin text-primary" />
                </div>
            ) : mappedRoles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {mappedRoles.map(role => (
                        <RoleCard
                            key={role.id}
                            role={role}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col h-[30vh] items-center justify-center w-full border-2 border-dashed border-white/10 rounded-xl bg-background/20">
                    <Shield className="size-12 text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-xl font-bold text-white/50">No hay roles registrados</h3>
                    <p className="text-sm text-muted-foreground mt-2">Haz clic en Crear Rol para añadir el primero.</p>
                </div>
            )}

            <RoleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                role={selectedRole}
                onSuccess={fetchRoles}
            />
        </div>
    )
}
