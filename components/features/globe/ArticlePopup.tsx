import { X } from 'lucide-react';
import { Article } from '@/lib/interfaces/article.interface';
import { useRef } from 'react';
import { ArticleCardInfo } from './ArticleCardInfo';

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

            <div className="max-h-64 overflow-y-auto select-none">
                <ArticleCardInfo article={article} descriptionLimit={20} />
            </div>
        </div>
    );
}
