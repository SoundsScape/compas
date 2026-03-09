import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { CheckCircle, MoreVertical, Trash2, XCircle, Pencil } from 'lucide-react';
import { ConfirmationModal } from './ConfirmationModal';
import { deleteArticle, validateArticle } from '@/lib/services/articleService';
import Link from 'next/link';

interface ActionsMenuProps {
    article: {
        id: number;
        status: string;
    };
    onActionSuccess: () => Promise<void>;
    userRole?: string;
}

export default function ActionsMenu({ article, onActionSuccess, userRole }: ActionsMenuProps) {
    const isStudent = userRole === 'student';
    const isPending = article.status === 'Pendiente';

    console.log("is student: ",isStudent, "pendiente: ", isPending);
    // Un estudiante solo puede editar/borrar si está pendiente.
    const canEditOrDelete = !isStudent || isPending;

    // Solo Profesores/Admins pueden validar/invalidar.
    const canValidate = !isStudent;

    console.log("can edit: ", canEditOrDelete, "Can Validate: ", canValidate);
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button disabled={!canEditOrDelete} variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-accent/90 text-white cursor-pointer">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Abrir menú</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-md border-white/10 text-white w-40">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />

                {canValidate && (
                    <>
                        {article.status === 'Pendiente' ? (
                            <DropdownMenuItem
                                onClick={async () => {
                                    await validateArticle(article.id, true);
                                    await onActionSuccess();
                                }}
                                className="cursor-pointer gap-2"
                            >
                                <CheckCircle className="size-4 text-green-500" />
                                Validar
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem
                                onClick={async () => {
                                    await validateArticle(article.id, false);
                                    await onActionSuccess();
                                }}
                                className="cursor-pointer gap-2"
                            >
                                <XCircle className="size-4 text-yellow-500" />
                                Invalidar
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator className="bg-white/10" />
                    </>
                )}

                {canEditOrDelete && (
                    <>
                        <DropdownMenuItem asChild>
                            <Link href={`/articles/edit/${article.id}`} className="cursor-pointer gap-2 flex items-center">
                                <Pencil className="size-4 text-accent" />
                                Editar
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="p-0 focus:bg-red-600/20">
                            <ConfirmationModal
                                title="Eliminar Artículo"
                                action="Eliminar"
                                description="¿Estás seguro de que quieres eliminar este artículo? Esta acción no se puede deshacer."
                                onConfirm={async () => {
                                    await deleteArticle(article.id);
                                    await onActionSuccess();
                                }}
                            >
                                <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors text-red-500 gap-2 w-full">
                                    <Trash2 className="size-4 text-red-500" />
                                    Eliminar
                                </div>
                            </ConfirmationModal>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
