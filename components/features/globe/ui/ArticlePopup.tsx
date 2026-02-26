/**
 * ArticlePopup.tsx
 * Ventana emergente (Tooltip/Popup) que se muestra sobre el globo 3D.
 * Contiene la información resumida del artículo y el botón para abrir el modal completo.
 */
import { X } from 'lucide-react';
import { Article } from '@/lib/interfaces/article.interface';
import { useRef } from 'react';
import { ArticleCardInfo } from './ArticleCardInfo';

interface ArticlePopupProps {
    article: Article;
    onClose: () => void;
    position?: [number, number, number];
    className?: string;
    onOpenModal: () => void;
    dateFormat?: 'AC/DC' | 'BCE/CE';
}

export function ArticlePopup({
    article,
    onClose,
    className = '',
    onOpenModal,
    dateFormat,
}: ArticlePopupProps) {
    const popupRef = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={popupRef}
            className={`w-xs -translate-x-1/4 transform rounded-lg bg-white p-5 shadow-sm backdrop-blur-md select-none ${className}`}
            onClick={e => e.stopPropagation()}
            onPointerOver={e => e.stopPropagation()}
            onWheel={e => e.stopPropagation()}
        >
            <div className="mb-3 flex items-center justify-between border-b border-gray-200 pb-2">
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

            <ArticleCardInfo
                article={article}
                onOpenModal={onOpenModal}
                dateFormat={dateFormat}
            />
        </div>
    );
}
