"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import UserActionsMenu from "@/components/shared/UserActionsMenu"

interface User {
    id: number
    username: string
    email: string
    school: string
    role: string
    status: string
}

interface UsersTableProps {
    users: User[];
    onEdit: (user: any) => void;
    onDeleteSuccess: () => Promise<void>;
}

export function UsersTable({ users, onEdit, onDeleteSuccess }: UsersTableProps) {
    return (
        <div className="relative rounded-md border bg-background/80 backdrop-blur-xl overflow-x-auto custom-scrollbar w-full">
            <Table >
                <TableHeader className="h-12 text-lg bg-linear-to-r from-secondary to-primary">
                    <TableRow className="hover:bg-transparent border">
                        <TableHead className="text-center w-16">ID</TableHead>
                        <TableHead className="w-16 md:w-32 truncate">Usuario</TableHead>
                        <TableHead className="max-w-28 truncate">Email</TableHead>
                        <TableHead className="max-w-28 md:max-w-32 truncate">Centro Educativo</TableHead>
                        <TableHead className="text-center w-24">Rol</TableHead>
                        <TableHead className="text-center w-24">Estado</TableHead>
                        <TableHead className="text-center w-16"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id} className="border hover:from-background hover:via-primary/80 hover:to-background hover:bg-linear-to-b transition-colors text-nowrap">
                            <TableCell className="text-muted-foreground text-center">{user.id}</TableCell>
                            <TableCell className="font-medium w-16 md:w-32 truncate">
                                <span className="text-white">
                                    {user.username}
                                </span>
                            </TableCell>
                            <TableCell className="text-muted-foreground max-w-32 truncate">
                                {user.email}
                            </TableCell>
                            <TableCell className="text-muted-foreground max-w-32 truncate">
                                {user.school}
                            </TableCell>
                            <TableCell className="text-center">
                                <Badge variant="outline" className="border-white/20 font-normal">
                                    {user.role}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                                <Badge
                                    className={user.status === 'activo'
                                        ? "bg-green-500 text-black min-w-16"
                                        : "bg-red-500 text-white min-w-16"
                                    }
                                >
                                    {user.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <UserActionsMenu
                                        userId={user.id}
                                        onEdit={() => onEdit(user)}
                                        onActionSuccess={onDeleteSuccess}
                                    />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
