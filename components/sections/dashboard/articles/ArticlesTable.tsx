import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import ActionsMenu from "@/components/shared/ActionsMenu"

interface Article {
    id: number
    title: string
    author: string
    school: string
    status: string
    date: string
}

interface ArticlesTableProps {
    articles: Article[];
    setIsModalOpen: (open: boolean) => void;
    onDeleteSuccess: () => Promise<void>;
    userRole?: string;
    isLoading?: boolean;
}

export function ArticlesTable({ articles, setIsModalOpen, onDeleteSuccess, userRole, isLoading }: ArticlesTableProps) {
    return (
        <div className={`rounded-md border overflow-x-auto custom-scrollbar w-full transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
            <Table>
                <TableHeader className="h-12 text-lg bg-linear-to-r from-secondary to-primary">
                    <TableRow className="hover:bg-transparent border">
                        <TableHead className="text-center">ID</TableHead>
                        <TableHead>Título</TableHead>
                        <TableHead>Autor</TableHead>
                        <TableHead>Centro</TableHead>
                        <TableHead className="text-center">Estado</TableHead>
                        <TableHead className="text-center max-w-24">Fecha</TableHead>
                        <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {articles.map((article) => (
                        <TableRow key={article.id} className="border hover:from-background/70 hover:via-primary/80 hover:to-background/70 hover:bg-linear-to-b transition-colors text-nowrap">
                            <TableCell className="text-muted-foreground text-center">{article.id}</TableCell>
                            <TableCell className="truncate">
                                <p className="max-w-48 md:max-w-full whitespace-normal line-clamp-2">{article.title}</p>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                                <p className="max-w-48 whitespace-normal line-clamp-2">{article.author}</p>
                            </TableCell>
                            <TableCell className="text-muted-foreground max-w-48 truncate">
                                <p className="max-w-48 whitespace-normal line-clamp-2">{article.school}</p>
                            </TableCell>
                            <TableCell className="w-[120px] text-center">
                                <Badge
                                    className={article.status === 'Validado'
                                        ? "bg-green-500 text-black hover:bg-green-500/90"
                                        : "bg-yellow-500 text-black hover:bg-yellow-500/90"
                                    }
                                >
                                    {article.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-center max-w-20">{article.date}</TableCell>
                            <TableCell className="text-right w-[160px]">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        onClick={e => {
                                            e.stopPropagation();
                                            sessionStorage.setItem('articleId', article.id.toString());
                                            setIsModalOpen(true);
                                        }}
                                        size="filter"
                                        variant="outline"
                                    >
                                        <Eye className="size-3.5" />
                                        Ver
                                    </Button>
                                    <ActionsMenu
                                        article={article}
                                        onActionSuccess={onDeleteSuccess}
                                        userRole={userRole}
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
