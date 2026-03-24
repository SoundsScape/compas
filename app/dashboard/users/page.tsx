"use client"

import { useState, useEffect, useMemo } from "react"
import { StatsCard } from "@/components/sections/dashboard/StatsCard"
import { UsersTable } from "@/components/sections/dashboard/users/UsersTable"
import { Button } from "@/components/ui/button"
import { Users, UserCheck, GraduationCap, Plus, Loader2 } from "lucide-react"
import { getUsers } from "@/lib/services/userService"
import { User } from "@/lib/interfaces/user.interface"
import DashboardPagination from "@/components/shared/Pagination"
import UserModal from "@/components/sections/dashboard/users/UserModal"
import DashboardHeader from "@/components/sections/dashboard/DashboardHeader"

export default function UsersDashboardPage() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const [limit] = useState(10)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const data = await getUsers()
            if (Array.isArray(data)) {
                setUsers(data)
                setTotalItems(data.length)
            }
        } catch (error) {
            console.error("Error fetching users:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleCreate = () => {
        setSelectedUser(null)
        setIsModalOpen(true)
    }

    const handleEdit = (mappedUser: any) => {
        const originalUser = users.find(u => u.id === mappedUser.id);
        if (originalUser) {
            setSelectedUser(originalUser)
            setIsModalOpen(true)
        }
    }

    const stats = useMemo(() => {
        const teachersActivos = users.filter(u =>
            u.role?.role_name === 'teacher' && u.status?.status_name === 'activo'
        ).length

        const alumnosActivos = users.filter(u =>
            u.role?.role_name === 'student' && u.status?.status_name === 'activo'
        ).length

        return {
            total: users.length,
            teachers: teachersActivos,
            students: alumnosActivos
        }
    }, [users])

    const mappedUsers = useMemo(() => {
        return users.slice((currentPage - 1) * limit, currentPage * limit).map(u => ({
            id: u.id,
            username: u.username,
            email: u.email,
            school: u.school?.name || "N/A",
            role: u.role?.role_name || "N/A",
            status: u.status?.status_name || "N/A"
        }))
    }, [users, currentPage, limit])

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="size-8 animate-spin text-accent" />
            </div>
        )
    }

    const totalPages = Math.ceil(totalItems / limit)

    return (
        <div className="flex flex-col gap-6 xl:gap-8 min-w-0 bg-radial to-75% from-primary to-background relative">
            <div className="flex flex-col gap-5 xl:gap-8">
                <DashboardHeader
                    title="Usuarios"
                    description="Gestiona los usuarios del sistema. Crea, edita o elimina usuarios."
                />
                <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
                    <StatsCard
                        title="Total de Usuarios"
                        value={stats.total}
                        icon={Users}
                    />
                    <StatsCard
                        title="Profesores Activos"
                        value={stats.teachers}
                        icon={UserCheck}
                    />
                    <StatsCard
                        title="Alumnos Activos"
                        value={stats.students}
                        icon={GraduationCap}
                    />
                </div>

            </div>
            <div className="flex justify-between items-center">
                <Button
                    onClick={handleCreate}
                >
                    <Plus className="size-5" />
                    Crear Usuario
                </Button>
                {totalItems > 0 && (
                    <DashboardPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                )}
            </div>
            <div className="min-w-0">
                <UsersTable
                    users={mappedUsers}
                    onEdit={handleEdit}
                    onDeleteSuccess={fetchUsers}
                />
            </div>
            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={selectedUser}
                onSuccess={fetchUsers}
            />
        </div>
    )
}
