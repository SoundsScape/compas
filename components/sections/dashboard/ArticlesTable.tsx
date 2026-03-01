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

interface Article {
    id: number
    title: string
    author: string
    school: string
    status: string
    date: string
}

interface ArticlesTableProps {
    articles: Article[]
}

export function ArticlesTable({ articles }: ArticlesTableProps) {
    return (
        <div className="rounded-md border bg-background/80 backdrop-blur-xl overflow-x-auto custom-scrollbar w-full">
            <Table>
                <TableHeader className="h-16 text-xl bg-linear-to-r from-primary to-transparent">
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
                        <TableRow key={article.id} className="border hover:from-background hover:via-primary/80 hover:to-background hover:bg-linear-to-b transition-colors text-nowrap">
                            <TableCell className="text-muted-foreground text-center">{article.id}</TableCell>
                            <TableCell className="font-medium truncate">
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
                            <TableCell className="text-muted-foreground text-center max-w-24">{article.date}</TableCell>
                            <TableCell className="text-right w-[180px]">
                                <div className="flex justify-end gap-2">
                                    <Button size="sm" variant="secondary" className="bg-accent hover:bg-accent/90 text-accent-foreground border-none gap-2">
                                        <Eye className="size-4" />
                                        Ver
                                    </Button>
                                    <Button size="sm" variant="destructive" className="bg-red-600 hover:bg-red-700 text-white border-none">
                                        Eliminar
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
