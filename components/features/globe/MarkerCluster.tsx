import { useState, useRef, useEffect, useMemo } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Article } from '../../../lib/interfaces/article.interface';
import { getHistoricalPeriod } from '../../../lib/utils/historicalPeriods';
import { limitWords } from '../../../lib/utils/textUtils';
import { ExternalLink, ArrowLeft, X } from 'lucide-react';

interface MarkerInfo {
    article: Article;
    position: [number, number, number];
}

interface MarkerClusterProps {
    position: [number, number, number];
    markers: MarkerInfo[];
    onHover: (isHovered: boolean) => void;
    cameraDistance?: number;
}

export function MarkerCluster({
    position,
    markers,
    onHover,
    cameraDistance = 3.5,
}: MarkerClusterProps) {
    const [hovered, setHovered] = useState(false);
    const [clicked, setClicked] = useState(false);
    const [activeMarkerIndex, setActiveMarkerIndex] = useState<number | null>(
        null
    );
    const sphereRef = useRef<THREE.Mesh>(null);
    const [popupPosition] = useState<'top' | 'bottom'>(
        position[1] > 0 ? 'bottom' : 'top'
    );
    const popupRef = useRef<HTMLDivElement>(null);

    const markerSize = useMemo(() => {
        const minDistance = 1.4;
        const maxDistance = 5;

        const baseSize = 0.018;

        const zoomFactor = Math.min(
            Math.max(
                (cameraDistance - minDistance) / (maxDistance - minDistance),
                0
            ),
            1
        );

        return baseSize * (0.3 + zoomFactor * 1.3);
    }, [cameraDistance]);

    const informativeMarkerSize = useMemo(() => {
        const minDistance = 1.4;
        const maxDistance = 5;

        const baseSize = 0.018;

        const zoomFactor = Math.min(
            Math.max(
                (cameraDistance - minDistance) / (maxDistance - minDistance),
                0
            ),
            1
        );

        return baseSize * (0.3 + zoomFactor * 1.3);
    }, [cameraDistance]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                clicked &&
                popupRef.current &&
                !popupRef.current.contains(event.target as Node)
            ) {
                setClicked(false);
                setHovered(false);
                onHover(false);
            }
        };

        if (clicked) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [clicked, onHover]);

    interface ThreeEvent extends THREE.Event {
        stopPropagation?: () => void;
    }

    const handlePointerOver = (e: ThreeEvent) => {
        e.stopPropagation?.();
        // Cambiar el cursor a pointer
        document.body.style.cursor = 'pointer';

        if (!clicked) {
            setHovered(true);
            onHover(true);
        }
    };

    const handlePointerOut = (e: ThreeEvent) => {
        e.stopPropagation?.();
        // Restaurar el cursor predeterminado
        document.body.style.cursor = 'auto';

        if (!clicked) {
            setHovered(false);
            onHover(false);
        }
    };

    const handleClick = (e: ThreeEvent) => {
        e.stopPropagation?.();
        setClicked(!clicked);
        setHovered(true);
        onHover(true);
    };

    const selectMarker = (index: number) => {
        setActiveMarkerIndex(index);
    };

    const backToList = () => {
        setActiveMarkerIndex(null);
    };

    const closeModal = () => {
        setActiveMarkerIndex(null);
        setClicked(false);
        setHovered(false);
        onHover(false);
    };

    const formatYear = (year: number) => {
        if (year < 0) {
            return `${Math.abs(year)} a.C.`;
        }
        return `${year} d.C.`;
    };

    const handleWheel = (e: React.WheelEvent) => {
        e.stopPropagation();
    };

    return (
        <group position={position}>
            <mesh
                ref={sphereRef}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
                onClick={handleClick}
            >
                <sphereGeometry args={[markerSize, 16, 16]} />
                <meshBasicMaterial
                    color={hovered || clicked ? '#ff6600' : '#ff9900'}
                />
            </mesh>

            {/* Número de puntos sobre el marcador */}
            <Html
                position={[0, informativeMarkerSize * 1.5, 0]}
                center
                style={{
                    width: '20px',
                    height: '20px',
                    transformOrigin: 'center center',
                    scale: '1',
                    userSelect: 'none',
                    pointerEvents: 'none',
                }}
                zIndexRange={[0, 0]}
                occlude={false}
            >
                <div className="pointer-events-none flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white select-none">
                    {markers.length}
                </div>
            </Html>

            {hovered && (
                <Html
                    position={[
                        0,
                        popupPosition === 'bottom'
                            ? -markerSize * 2.5
                            : markerSize * 2.5,
                        0,
                    ]}
                    className={`pointer-events-auto ${popupPosition === 'bottom' ? 'origin-top' : 'origin-bottom'}`}
                    center
                    style={{
                        pointerEvents: 'auto',
                        transform: `translate(10%, ${popupPosition === 'bottom' ? '5%' : '-93%'})`,
                        zIndex: 10,
                        width: '325px',
                        transformOrigin: 'center center',
                        scale: '1.15',
                    }}
                    zIndexRange={[10, 100]}
                >
                    <div
                        ref={popupRef}
                        className="w-full -translate-x-1/4 transform rounded-lg bg-white/90 p-4 shadow-lg backdrop-blur-md select-none"
                        onClick={e => {
                            e.stopPropagation();
                        }}
                        onPointerOver={e => {
                            e.stopPropagation();
                            onHover(true);
                        }}
                        onWheel={handleWheel}
                    >
                        {activeMarkerIndex === null ? (
                            <>
                                <div className="mb-3 flex items-center justify-between border-b border-gray-200 pb-2">
                                    <div className="w-5"></div>
                                    <button
                                        className="ml-auto cursor-pointer text-gray-500 select-none hover:text-gray-800"
                                        onClick={closeModal}
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                                <h3 className="mb-3 text-lg font-bold text-gray-900 select-none">
                                    Grupo de {markers.length} ubicaciones
                                </h3>
                                <div
                                    className="max-h-64 overflow-y-auto select-none"
                                    onWheel={handleWheel}
                                >
                                    {markers.map((marker, idx) => (
                                        <div
                                            key={idx}
                                            className="mb-2 cursor-pointer rounded border border-gray-200 p-2 select-none hover:bg-gray-100"
                                            onClick={() => selectMarker(idx)}
                                        >
                                            <div className="flex items-start justify-between text-black select-none">
                                                <span className="text-sm font-medium">
                                                    {marker.article.titulo}
                                                </span>
                                                <span className="text-xs">
                                                    {formatYear(
                                                        marker.article.fecha
                                                    )}
                                                </span>
                                            </div>
                                            <span className="mt-1 block text-xs text-gray-600 select-none">
                                                {limitWords(
                                                    marker.article
                                                        .templates?.[0]
                                                        ?.text_areas?.[0]
                                                        ?.content || '',
                                                    10
                                                )}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="mb-3 flex items-center justify-between border-b border-gray-200 pb-2">
                                    <button
                                        className="cursor-pointer text-gray-500 select-none hover:text-gray-800"
                                        onClick={backToList}
                                    >
                                        <ArrowLeft className="h-5 w-5" />
                                    </button>
                                    <button
                                        className="cursor-pointer text-gray-500 select-none hover:text-gray-800"
                                        onClick={closeModal}
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                                <h3 className="mb-2 text-lg font-bold text-gray-900 select-none">
                                    {markers[activeMarkerIndex].article.titulo}
                                </h3>
                                <div className="mb-2 text-sm font-medium text-gray-800 select-none">
                                    {formatYear(
                                        markers[activeMarkerIndex].article.fecha
                                    )}
                                </div>
                                <div
                                    className="max-h-64 overflow-y-auto select-none"
                                    onWheel={handleWheel}
                                >
                                    <p className="mb-3 text-sm text-gray-600 select-none">
                                        {limitWords(
                                            markers[activeMarkerIndex].article
                                                .templates?.[0]?.text_areas?.[0]
                                                ?.content || ''
                                        )}
                                    </p>
                                    <div className="mb-3 flex flex-wrap gap-1 select-none">
                                        <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-800 select-none">
                                            {getHistoricalPeriod(
                                                markers[activeMarkerIndex]
                                                    .article.fecha
                                            )}
                                        </span>
                                        {markers[activeMarkerIndex].article
                                            .tags &&
                                        markers[activeMarkerIndex].article.tags
                                            .length > 0 ? (
                                            markers[
                                                activeMarkerIndex
                                            ].article.tags.map((tag, idx) => (
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
                                </div>
                                <div className="mb-3 select-none">
                                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800 select-none">
                                        Autor de artículo:{' '}
                                        {
                                            markers[activeMarkerIndex].article
                                                .nombre_autor
                                        }{' '}
                                        {
                                            markers[activeMarkerIndex].article
                                                .apellidos_autor
                                        }
                                    </span>
                                </div>
                                <a
                                    href={`/articles/view/${markers[activeMarkerIndex].article.id}`}
                                    className="inline-flex cursor-pointer items-center gap-1 text-sm text-blue-600 select-none hover:text-blue-800"
                                    onClick={() => {
                                        closeModal();
                                    }}
                                    target="_blank"
                                >
                                    Ver más <ExternalLink className="h-4 w-4" />
                                </a>
                            </>
                        )}
                    </div>
                </Html>
            )}
        </group>
    );
}
