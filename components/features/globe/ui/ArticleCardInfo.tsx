/**
 * ArticleCardInfo.tsx
 * Componente de bajo nivel que renderiza la ficha técnica de un artículo.
 * Se utiliza tanto en los popups del globo 3D como en los del mapa 2D.
 */
import { Article } from '@/lib/interfaces/article.interface';
import { getHistoricalPeriod } from '@/lib/utils/historicalPeriods';
import { limitWords } from '@/lib/utils/textUtils';
import { formatYear } from '@/lib/utils/dateUtils';
import { ExternalLink } from 'lucide-react';

interface ArticleCardInfoProps {
    article: Article;
    descriptionLimit?: number;
    onOpenModal?: () => void;
    dateFormat?: 'AC/DC' | 'BCE/CE';
}

export function ArticleCardInfo({
    article,
    descriptionLimit = 20,
    onOpenModal,
    dateFormat,
}: ArticleCardInfoProps) {
    return (
        <div className="flex max-h-80 flex-col gap-3 select-none">
            <div className="flex items-start justify-between">
                <h3 className="text-xl font-bold text-gray-900 select-none">
                    {article.titulo}
                </h3>
                <span className="mt-1 text-sm font-medium whitespace-nowrap text-gray-800 select-none">
                    {formatYear(article.fecha, dateFormat)}
                </span>
            </div>

            <p className="text-sm text-gray-600 select-none">
                {limitWords(
                    article.templates?.[0]?.text_areas?.[0]?.content || '',
                    descriptionLimit
                )}
            </p>

            <div className="flex flex-wrap gap-1 select-none">
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
                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-800 select-none">
                        Sin etiquetas
                    </span>
                )}
            </div>

            <p className="w-fit rounded-full bg-green-50 p-1 px-2 text-sm text-green-700 select-none">
                Autor:{' '}
                <span className="font-semibold">
                    {article.nombre_autor} {article.apellidos_autor}
                </span>
            </p>

            <button
                onClick={e => {
                    e.stopPropagation();
                    sessionStorage.setItem('articleId', article.id.toString());
                    onOpenModal?.();
                }}
                className="flex w-fit items-center gap-2 px-2 py-1 text-sm text-blue-600 select-none hover:text-blue-800"
            >
                Ver más <ExternalLink className="h-4 w-4" />
            </button>
        </div>
    );
}
