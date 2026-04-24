/**
 * ClusterPopup.tsx
 * Popup para agrupaciones de artículos en el globo 3D.
 * Permite listar múltiples artículos y navegar a la vista individual de cada uno.
 */
import { useState, useRef } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { formatYear } from '@/lib/utils/dateUtils';
import { limitWords } from '@/lib/utils/textUtils';
import { MarkerInfo } from '@/lib/interfaces/globe.interface';
import { ArticlePopup } from './ArticlePopup';
import { useViewportClamp } from '@/lib/hooks/useViewportClamp';

interface ClusterPopupProps {
    markers: MarkerInfo[];
    onClose: () => void;
    onHover: (isHovered: boolean) => void;
    setIsModalOpen: (open: boolean) => void;
    dateFormat?: 'AC/DC' | 'BCE/CE';
}

export function ClusterPopup({
    markers,
    onClose,
    onHover,
    setIsModalOpen,
    dateFormat,
}: ClusterPopupProps) {
    const [activeMarkerIndex, setActiveMarkerIndex] = useState<number | null>(
        null
    );
    const scrollRef = useRef<HTMLDivElement>(null);
    const { clampRef, clampTransform, isClampReady } = useViewportClamp({
        topPadding: 92,
        bottomPadding: 24,
    });

    const handleWheel = (e: React.WheelEvent) => {
        e.stopPropagation();
    };

    return (
        <>
            {activeMarkerIndex === null ? (
                <div
                    ref={clampRef}
                    className="w-[min(86vw,20rem)] rounded-lg bg-white/90 p-4 shadow-lg backdrop-blur-md select-none"
                    style={{
                        transform: clampTransform,
                        visibility: isClampReady ? 'visible' : 'hidden',
                    }}
                    onClick={e => e.stopPropagation()}
                    onPointerOver={e => {
                        e.stopPropagation();
                        onHover(true);
                    }}
                    onWheel={handleWheel}
                >
                    <div className="mb-3 flex items-center justify-between border-b border-gray-200 pb-2">
                        <div className="w-5"></div>
                        <button
                            className="ml-auto cursor-pointer text-gray-500 select-none hover:text-gray-800"
                            onClick={onClose}
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <h3 className="mb-3 text-lg font-bold text-gray-900 select-none">
                        Grupo de {markers.length} ubicaciones
                    </h3>
                    <div
                        ref={scrollRef}
                        className="max-h-64 overflow-y-auto select-none"
                        onWheel={handleWheel}
                    >
                        {markers.map((marker, idx) => (
                            <div
                                key={idx}
                                className="mb-2 cursor-pointer rounded border border-gray-200 p-2 select-none hover:bg-gray-100"
                                onClick={() => setActiveMarkerIndex(idx)}
                            >
                                <div className="flex items-start justify-between text-black select-none">
                                    <span className="text-sm font-medium">
                                        {marker.article.titulo}
                                    </span>
                                    <span className="text-xs">
                                        {formatYear(
                                            marker.article.fecha,
                                            dateFormat
                                        )}
                                    </span>
                                </div>
                                <span className="mt-1 block text-xs text-gray-600 select-none">
                                    {limitWords(
                                        marker.article.templates?.[0]
                                            ?.text_areas?.[0]?.content || '',
                                        10
                                    )}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="relative">
                    <ArticlePopup
                        article={markers[activeMarkerIndex].article}
                        onClose={onClose}
                        onOpenModal={() => {
                            setIsModalOpen(true);
                            onClose();
                        }}
                        dateFormat={dateFormat}
                    />
                    <button
                        className="absolute top-4 left-2 z-20 cursor-pointer text-gray-500 hover:text-gray-800"
                        onClick={e => {
                            e.stopPropagation();
                            setActiveMarkerIndex(null);
                        }}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                </div>
            )}
        </>
    );
}
