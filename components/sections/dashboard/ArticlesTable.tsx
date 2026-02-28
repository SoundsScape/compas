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
        <div className="rounded-md overflow-hidden border bg-background/80 backdrop-blur-xl overflow-x-auto custom-scrollbar">
            <Table>
                <TableHeader className="h-16 text-xl bg-linear-to-r from-primary to-transparent">
                    <TableRow className="hover:bg-transparent border">
                        <TableHead>ID</TableHead>
                        <TableHead>Título</TableHead>
                        <TableHead>Autor</TableHead>
                        <TableHead>Centro</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {articles.map((article) => (
                        <TableRow key={article.id} className="border hover:from-background hover:via-primary/80 hover:to-background hover:bg-linear-to-b  transition-colors">
                            <TableCell className="text-white/70 font-mono">{article.id}</TableCell>
                            <TableCell className="text-white font-medium">{article.title}</TableCell>
                            <TableCell className="text-white/80">{article.author}</TableCell>
                            <TableCell className="text-white/80">{article.school}</TableCell>
                            <TableCell>
                                <Badge
                                    className={article.status === 'Validado'
                                        ? "bg-[#00c853] text-black hover:bg-[#00c853]/90"
                                        : "bg-yellow-500 text-black hover:bg-yellow-500/90"
                                    }
                                >
                                    {article.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-white/60">{article.date}</TableCell>
                            <TableCell className="text-right">
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
