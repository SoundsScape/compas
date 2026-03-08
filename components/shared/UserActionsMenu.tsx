"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { MoreVertical, Trash2, User as UserIcon, Edit2 } from 'lucide-react';
import { ConfirmationModal } from './ConfirmationModal';
import { deleteUser } from '@/lib/services/userService';
import Link from 'next/link';

interface UserActionsMenuProps {
    userId: number;
    onEdit: () => void;
    onActionSuccess: () => Promise<void>;
}

export default function UserActionsMenu({ userId, onEdit, onActionSuccess }: UserActionsMenuProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-accent  text-white cursor-pointer">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Abrir menú</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-md border-white/10 text-white w-48">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />

                <DropdownMenuItem asChild className="cursor-pointer gap-2">
                    <Link href={`/dashboard/user-info/${userId}`}>
                        <UserIcon className="size-4 text-accent" />
                        Ver Perfil
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={onEdit} className="cursor-pointer gap-2">
                    <Edit2 className="size-4 text-primary" />
                    Editar
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="p-0 focus:bg-red-600/20">
                    <ConfirmationModal
                        title="Eliminar Usuario"
                        action="Eliminar"
                        description="¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer."
                        onConfirm={async () => {
                            await deleteUser(userId);
                            await onActionSuccess();
                        }}
                    >
                        <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors text-red-500 gap-2 w-full">
                            <Trash2 className="size-4 text-red-500" />
                            Eliminar
                        </div>
                    </ConfirmationModal>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
