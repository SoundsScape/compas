import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, BookOpen } from 'lucide-react';
import { Article } from '@/lib/interfaces/article.interface';
import { getHistoricalPeriod } from '@/lib/utils/historicalPeriods';
import { limitWords } from '@/lib/utils/textUtils';
import { formatYear } from '@/lib/utils/dateUtils';

interface ArticleCardProps {
    article: Article;
    setIsModalOpen: (open: boolean) => void;
}

export default function ArticleCard({ article, setIsModalOpen }: ArticleCardProps) {
    const historicalPeriod = getHistoricalPeriod(article.fecha);
    const summary = article.templates?.[0]?.text_areas?.[0]?.content || 'Sin contenido disponible';

    return (
        <Card className='border-border/10 hover:border-border/50 hover:shadow-lg hover:shadow-border/50 rounded-lg transition-all duration-300'>
            <CardHeader>
                <CardTitle className="text-2xl font-bold mb-3">
                    {article.titulo}
                </CardTitle>
                <div className="flex justify-between items-start gap-4">
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-none transition-colors">
                            <Calendar className="size-3 mr-1" />
                            {formatYear(article.fecha)}
                        </Badge>
                        <Badge variant="outline" className="text-accent border-accent/30 bg-accent/5">
                            {historicalPeriod}
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="grow text-sm text-muted-foreground leading-relaxed">
                <p className="line-clamp-4">
                    {limitWords(summary, 25)}
                </p>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
                <div className="w-full h-px bg-linear-to-r from-white/10 via-white/5 to-transparent" />

                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="size-7 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                            <User className="size-4" />
                        </div>
                        <span className="font-medium">
                            {article.nombre_autor} {article.apellidos_autor}
                        </span>
                    </div>

                    <Button
                        onClick={e => {
                            e.stopPropagation();
                            setIsModalOpen(true);
                            sessionStorage.setItem('articleId', article.id.toString());
                        }}
                        variant="outline"
                        size="sm"
                        className="bg-accent/10 hover:bg-accent text-accent hover:text-accent-foreground border-accent/20 transition-all duration-300"
                    >
                        <BookOpen className="size-4 mr-2" />
                        Leer más
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
