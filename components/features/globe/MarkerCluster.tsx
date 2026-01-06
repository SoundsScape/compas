import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { ThreeEvent } from '@react-three/fiber';
import { Article } from '@/lib/interfaces/article.interface';
import { limitWords } from '@/lib/utils/textUtils';
import { formatYear } from '@/lib/utils/dateUtils';
import { ArrowLeft, X } from 'lucide-react';
import { useMarkerSize } from '@/lib/hooks/useMarkerSize';
import { ArticlePopup } from './ArticlePopup';
import { MarkerClusterProps } from '@/lib/interfaces/globe.interface';



function MarkerClusterBase({
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
    const [popupPosition, setPopupPosition] = useState<'top' | 'bottom'>('top');
    const popupRef = useRef<HTMLDivElement>(null);

    // Usar hook para tamaño. Escalamos un poco más los clusters (1.3x)
    const markerSize = useMarkerSize(cameraDistance, 0.018, 1.3);
    // Tamaño para el badge de número, un poco más pequeño
    const informativeMarkerSize = useMarkerSize(cameraDistance, 0.018, 1.3);

    useEffect(() => {
        setPopupPosition(position[1] > 0 ? 'bottom' : 'top');
    }, [position]);

    const closeModal = useCallback(() => {
        setActiveMarkerIndex(null);
        setClicked(false);
        setHovered(false);
        onHover(false);
    }, [onHover]);

    useEffect(() => {
        const handleClickOutside = () => {
            if (clicked) {
                closeModal();
            }
        };
        if (clicked) {
            setTimeout(
                () => document.addEventListener('click', handleClickOutside),
                0
            );
        }
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [clicked, closeModal]);

    const handlePointerOver = useCallback(
        (e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation();
            document.body.style.cursor = 'pointer';

            if (!clicked) {
                setHovered(true);
                onHover(true);
            }
        },
        [clicked, onHover]
    );

    const handlePointerOut = useCallback(
        (e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation();
            document.body.style.cursor = 'auto';
            if (!clicked) {
                setHovered(false);
                onHover(false);
            }
        },
        [clicked, onHover]
    );

    const handleClick = useCallback(
        (e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation();
            setClicked(!clicked);
            setHovered(true);
            onHover(true);
        },
        [clicked, onHover]
    );

    const selectMarker = (index: number) => {
        setActiveMarkerIndex(index);
    };

    const backToList = () => {
        setActiveMarkerIndex(null);
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

            {/* Indicador de número de items */}
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
                    center
                    style={{
                        zIndex: 10,
                        width: '325px',
                        transform:
                            popupPosition === 'bottom'
                                ? 'translateY(5%)'
                                : 'translateY(-93%)',
                    }}
                >
                    {activeMarkerIndex === null ? (
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
                                                marker.article.templates?.[0]
                                                    ?.text_areas?.[0]
                                                    ?.content || '',
                                                10
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        // VISTA DE DETALLE (USANDO ArticlePopup)
                        <div className="relative">
                            <ArticlePopup
                                article={markers[activeMarkerIndex].article}
                                onClose={closeModal}
                            />
                            {/* Botón flotante para volver atrás */}
                            <button
                                className="absolute top-4 -left-14 z-20 cursor-pointer text-gray-500 hover:text-gray-800"
                                onClick={e => {
                                    e.stopPropagation();
                                    backToList();
                                }}
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                        </div>
                    )}
                </Html>
            )}
        </group>
    );
}
export const MarkerCluster = memo(MarkerClusterBase);
