/**
 * MapMarker.tsx (2D)
 * Adaptador de marcador para Leaflet.
 * Renderiza el ArticleCardInfo dentro de un Popup nativo del mapa 2D.
 */
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Article } from '@/lib/interfaces/article.interface';
import { ArticleCardInfo } from '../ui/ArticleCardInfo';
import { X } from 'lucide-react';
import { useMapFloatingCard } from '@/lib/hooks/useMapFloatingCard';

// Importaciones dinámicas para Leaflet (solo cliente)
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), {
    ssr: false,
});

interface MapMarkerProps {
    article: Article;
    setIsModalOpen: (value: boolean) => void;
    dateFormat?: 'AC/DC' | 'BCE/CE';
}

export default function MapMarker({
    article,
    setIsModalOpen,
    dateFormat,
}: MapMarkerProps) {
    const markerPosition = useMemo<[number, number]>(
        () => [parseFloat(article.latitud), parseFloat(article.longitud)],
        [article.latitud, article.longitud]
    );
    const { isCardOpen, cardPosition, openCard, closeCard } = useMapFloatingCard({
        markerPosition,
    });

    return (
        <>
            <Marker
                position={markerPosition}
                eventHandlers={{
                    click: openCard,
                }}
            />

            {isCardOpen &&
                createPortal(
                    <div
                        className="map-floating-article-card fixed z-120 w-[min(86vw,20rem)] rounded-lg bg-white p-5 shadow-sm backdrop-blur-md select-none"
                        style={{ left: `${cardPosition.left}px`, top: `${cardPosition.top}px` }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="mb-3 flex items-center justify-between border-b border-gray-200 pb-2">
                            <button
                                className="ml-auto cursor-pointer text-gray-500 select-none hover:text-gray-800"
                                onClick={e => {
                                    e.stopPropagation();
                                    closeCard();
                                }}
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <ArticleCardInfo
                            article={article}
                            onOpenModal={() => {
                                closeCard();
                                setIsModalOpen(true);
                            }}
                            dateFormat={dateFormat}
                        />
                    </div>,
                    document.body
                )}
        </>
    );
}
