import { ExternalLink, X } from 'lucide-react';
import { Article } from '@/lib/interfaces/article.interface';
import { getHistoricalPeriod } from '@/lib/utils/historicalPeriods';
import { limitWords } from '@/lib/utils/textUtils';
import { formatYear } from '@/lib/utils/dateUtils';
import { useRef } from 'react';

interface ArticlePopupProps {
    article: Article;
    onClose: () => void;
    position?: [number, number, number]; // Posición opcional para el HTML wrapper
    className?: string;
}

export function ArticlePopup({
    article,
    onClose,
    className = '',
}: ArticlePopupProps) {
    const popupRef = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={popupRef}
            className={`w-full -translate-x-1/4 transform rounded-lg bg-white/90 p-4 shadow-lg backdrop-blur-md select-none ${className}`}
            onClick={e => e.stopPropagation()}
            onPointerOver={e => e.stopPropagation()}
            onWheel={e => e.stopPropagation()}
        >
            <div className="mb-3 flex items-center justify-between border-b border-gray-200 pb-2">
                <div className="w-5 select-none"></div>
                <button
                    className="ml-auto cursor-pointer text-gray-500 select-none hover:text-gray-800"
                    onClick={e => {
                        e.stopPropagation();
                        onClose();
                    }}
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            <h3 className="mb-2 text-xl font-bold text-gray-900 select-none">
                {article.titulo}
            </h3>

            <div className="mb-2 text-sm font-medium text-gray-800 select-none">
                {formatYear(article.fecha)}
            </div>

            <div className="max-h-64 overflow-y-auto select-none">
                <p className="mb-3 text-sm text-gray-600 select-none">
                    {limitWords(
                        article.templates?.[0]?.text_areas?.[0]?.content || '',
                        20
                    )}
                </p>

                <div className="mb-3 flex flex-wrap gap-1 select-none">
                    <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-800 select-none">
                        {getHistoricalPeriod(article.fecha)}
                    </span>
                    {article.tags && article.tags.length > 0 ? (
                        article.tags.map((tag, idx) => (
                            <span
                                key={idx}
                                className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800 select-none"
                            >
                                {tag.name}
                            </span>
                        ))
                    ) : (
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
                    className="inline-flex cursor-pointer items-center gap-1 text-sm text-blue-600 select-none hover:text-blue-800"
                    onClick={e => e.stopPropagation()}
                >
                    Ver más <ExternalLink className="h-4 w-4" />
                </a>
            </div>
        </div>
    );
}
