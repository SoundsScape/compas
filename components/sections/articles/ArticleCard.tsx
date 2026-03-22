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
        <Card className='group relative overflow-hidden lg:py-8 lg:px-3 border-none'>
            <div className="absolute inset-0 bg-radial-[at_top_left] from-secondary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <div className="absolute -bottom-52 -right-44 w-96 aspect-square rounded-full border-none
                        flex gap-2 px-32 py-36 text-xs cursor-pointer bg-secondary/60 text-accent 
                        group-hover:scale-150 lg:group-hover:scale-145 2xl:group-hover:scale-155 group-hover:bg-secondary transition-all duration-300"></div>
            <CardHeader className='z-10'>
                <CardTitle className="text-xl lg:text-2xl font-bold mb-3 bg-clip-text text-transparent bg-linear-to-r from-white to-white  group-hover:from-accent group-hover:via-white group-hover:to-white/70 transition-colors duration-300">
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

            <CardContent className="grow text-sm text-muted-foreground leading-relaxed tracking-normal z-10">
                <p className="line-clamp-4">
                    {limitWords(summary, 25)}
                </p>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 z-10">
                <div className="w-full h-px bg-linear-to-r from-white/10 via-white/5 to-transparent" />

                <div className="relative flex items-center justify-between w-full">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="size-7 rounded-full bg-muted/50 text-accent border shadow-inner flex items-center justify-center">
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
                        variant="ghost"
                        size="sm"
                        className="border border-white/20 group-hover:border-accent/70 group-hover:text-accent/90 hover:border-accent hover:bg-white/5"
                    >
                        <BookOpen className="size-4" />
                        <span className="">Leer</span>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
