import { ExternalLink } from 'lucide-react';
import { Article } from '@/lib/interfaces/article.interface';
import { getHistoricalPeriod } from '@/lib/utils/historicalPeriods';
import { limitWords } from '@/lib/utils/textUtils';
import { formatYear } from '@/lib/utils/dateUtils';

interface ArticleCardInfoProps {
    article: Article;
    descriptionLimit?: number;
}

export function ArticleCardInfo({
    article,
    descriptionLimit = 20,
}: ArticleCardInfoProps) {
    return (
        <div className="select-none">
            <div className="mb-2 flex items-start justify-between">
                <h3 className="text-xl font-bold text-gray-900 select-none">
                    {article.titulo}
                </h3>
                <span className="ml-2 text-sm font-medium whitespace-nowrap text-gray-800 select-none">
                    {formatYear(article.fecha)}
                </span>
            </div>

            <p className="mb-3 text-sm text-gray-600 select-none">
                {limitWords(
                    article.templates?.[0]?.text_areas?.[0]?.content || '',
                    descriptionLimit
                )}
            </p>

            <div className="mb-3 flex flex-wrap gap-1 select-none">
                <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-800 select-none">
                    {getHistoricalPeriod(article.fecha)}
                </span>
                {article.tags?.map((tag, idx) => (
                    <span
                        key={idx}
                        className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800 select-none"
                    >
                        {tag.name}
                    </span>
                ))}
                {!article.tags?.length && (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800 select-none">
                        Sin etiquetas
                    </span>
                )}
            </div>

            <div className="mb-3 select-none">
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800 select-none">
                    Autor: {article.nombre_autor} {article.apellidos_autor}
                </span>
            </div>

            <a
                href={`/articles/view/${article.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex cursor-pointer items-center gap-1 text-sm text-blue-600 select-none hover:text-blue-800"
                onClick={e => e.stopPropagation()}
            >
                Ver más <ExternalLink className="h-4 w-4" />
            </a>
        </div>
    );
}
