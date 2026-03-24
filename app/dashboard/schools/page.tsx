"use client"

import { useState, useEffect, useMemo } from "react"
import SchoolCard from "@/components/sections/dashboard/schools/SchoolCard"
import SchoolModal from "@/components/sections/dashboard/schools/SchoolModal"
import { Button } from "@/components/ui/button"
import { School, Plus, Loader2 } from "lucide-react"
import { getSchools, deleteSchool } from "@/lib/services/schoolService"
import { SchoolResponseObject } from "@/lib/interfaces/school.interface"
import DashboardPagination from "@/components/shared/Pagination"
import { toast } from "sonner"
import DashboardHeader from "@/components/sections/dashboard/DashboardHeader"
import Loader from "@/components/shared/Loader"

export default function SchoolsDashboardPage() {
    const [schools, setSchools] = useState<SchoolResponseObject[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const [limit] = useState(12)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedSchool, setSelectedSchool] = useState<SchoolResponseObject | null>(null)

    const fetchSchools = async () => {
        setLoading(true)
        try {
            const res = await getSchools()
            const data = res.data || res;
            if (Array.isArray(data)) {
                setSchools(data)
                setTotalItems(data.length)
            }
        } catch (error) {
            console.error("Error fetching schools:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSchools()
    }, [])

    const handleCreate = () => {
        setSelectedSchool(null)
        setIsModalOpen(true)
    }

    const handleEdit = (school: SchoolResponseObject) => {
        setSelectedSchool(school)
        setIsModalOpen(true)
    }

    const handleDelete = async (id: number) => {
        setLoading(true)
        try {
            await deleteSchool(id)
            fetchSchools()
        } catch (error) {
            console.error("Error al eliminar la escuela", error)
        } finally {
            setLoading(false);
            toast.success("Centro eliminado correctamente")
        }
    }


    const mappedSchools = useMemo(() => {
        return schools.slice((currentPage - 1) * limit, currentPage * limit)
    }, [schools, currentPage, limit])

    const totalPages = Math.ceil(totalItems / limit)

    return (
        <div className="flex flex-col gap-9 min-w-0">

            <div className="flex flex-col justify-between items-start gap-8">
                <DashboardHeader title="Escuelas" description="Gestiona los centros educativos. Crea, edita o elimina centros educativos." />
                <Button onClick={handleCreate} >
                    <Plus className="size-5" />
                    Registrar Centro
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
                <Loader />
            ) : mappedSchools.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {mappedSchools.map(school => (
                        <SchoolCard
                            key={school.id}
                            school={school}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col h-[30vh] items-center justify-center w-full border-2 border-dashed border-white/10 rounded-xl bg-background/20">
                    <School className="size-12 text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-xl font-bold text-white/50">No hay centros registrados</h3>
                    <p className="text-sm text-muted-foreground mt-2">Haz clic en Registrar Centro para añadir el primero.</p>
                </div>
            )}

            <SchoolModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                school={selectedSchool}
                onSuccess={fetchSchools}
            />
        </div>
    )
}
