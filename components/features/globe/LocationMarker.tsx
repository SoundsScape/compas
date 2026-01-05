import { useState, useRef, useEffect, useMemo, useCallback, memo } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { ExternalLink, X } from 'lucide-react';

interface LocationMarkerProps {
    position: [number, number, number];
    name: string;
    description: string;
    onHover: (isHovered: boolean) => void;
    category: string;
    region: string;
    year: number;
    tags?: { id: number; name: string; pivot: any }[];
    autor: string;
    apellidos: string;
    cameraDistance?: number;
    id: number;
}

// Definir primero el componente base y luego aplicar memo
function LocationMarkerBase({
    position,
    name,
    description,
    onHover,
    category,
    year,
    tags = [],
    autor,
    apellidos,
    cameraDistance = 3.5,
    id,
}: LocationMarkerProps) {
    const [hovered, setHovered] = useState(false);
    const [clicked, setClicked] = useState(false);
    const sphereRef = useRef<THREE.Mesh>(null);
    const [popupPosition, setPopupPosition] = useState<'top' | 'bottom'>('top');
    const popupRef = useRef<HTMLDivElement>(null);

    const markerSize = useMemo(() => {
        // Rangos de zoom actualizados según DEFAULT_CAMERA en GlobeMain.tsx
        const minDistance = 1.4;
        const maxDistance = 5;

        const baseSize = 0.013;

        // Calcular factor de zoom - ahora queremos que el marcador sea MÁS pequeño cuando está cerca
        // y más grande cuando está lejos, contrario a la lógica anterior
        const zoomFactor = Math.min(
            Math.max(
                (cameraDistance - minDistance) / (maxDistance - minDistance),
                0
            ),
            1
        );

        // Cuando estamos muy cerca (minDistance), zoomFactor es cercano a 0 y queremos que el marcador sea más pequeño
        // Cuando estamos lejos (maxDistance), zoomFactor es cercano a 1 y queremos que el marcador sea más grande
        return baseSize * (0.3 + zoomFactor * 2);
    }, [cameraDistance]);

    useEffect(() => {
        setPopupPosition(position[1] > 0 ? 'bottom' : 'top');
    }, [position]);

    useEffect(() => {
        const handleClickOuside = (event: MouseEvent) => {
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
            document.addEventListener('click', handleClickOuside);
        }

        return () => {
            document.removeEventListener('click', handleClickOuside);
        };
    }, [clicked, onHover]);

    interface ThreeEvent extends THREE.Event {
        stopPropagation?: () => void;
    }

    const handlePointerOver = useCallback(
        (e: ThreeEvent) => {
            e.stopPropagation?.();

            // Cambiar el cursor a pointer
            document.body.style.cursor = 'pointer';

            if (!clicked) {
                setHovered(true);
                onHover(true);
            }
        },
        [clicked, onHover]
    );

    const handlePointerOut = useCallback(
        (e: ThreeEvent) => {
            e.stopPropagation?.();

            // Restaurar el cursor predeterminado
            document.body.style.cursor = 'auto';

            if (!clicked) {
                setHovered(false);
                onHover(false);
            }
        },
        [clicked, onHover]
    );

    const handleClick = useCallback(
        (e: ThreeEvent) => {
            e.stopPropagation?.();
            setClicked(!clicked);
            setHovered(true);
            onHover(true);
        },
        [clicked, onHover]
    );

    const formatYear = (year: number) => {
        if (year < 0) {
            return `${Math.abs(year)} a.C.`;
        }
        return `${year} d.C.`;
    };

    const handleLinkClick = useCallback(() => {
        setClicked(false);
        setHovered(false);
        onHover(false);
    }, [onHover]);

    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.stopPropagation();
    }, []);

    const closePopup = useCallback(() => {
        setClicked(false);
        setHovered(false);
        onHover(false);
    }, [onHover]);

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
                    color={hovered || clicked ? '#ff4444' : 'red'}
                />
            </mesh>
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
                        <div className="mb-3 flex items-center justify-between border-b border-gray-200 pb-2">
                            <div className="w-5 select-none"></div>
                            <button
                                className="ml-auto cursor-pointer text-gray-500 select-none hover:text-gray-800"
                                onClick={closePopup}
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-gray-900 select-none">
                            {name}
                        </h3>
                        <div className="mb-2 text-sm font-medium text-gray-800 select-none">
                            {formatYear(year)}
                        </div>
                        <div
                            className="max-h-64 overflow-y-auto select-none"
                            onWheel={handleWheel}
                        >
                            <p className="mb-3 text-sm text-gray-600 select-none">
                                {description}
                            </p>
                            <div className="mb-3 flex flex-wrap gap-1 select-none">
                                <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-800 select-none">
                                    {category}
                                </span>
                                {tags && tags.length > 0 ? (
                                    tags.map((tag, idx) => (
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
                                    Autor de artículo: {autor} {apellidos}
                                </span>
                            </div>
                            <a
                                href={`/articles/view/${id}`}
                                className="inline-flex cursor-pointer items-center gap-1 text-sm text-blue-600 select-none hover:text-blue-800"
                                onClick={handleLinkClick}
                                target="_blank"
                            >
                                Ver más <ExternalLink className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </Html>
            )}
        </group>
    );
}

// Aplicar memo al componente base
export const LocationMarker = memo(LocationMarkerBase);
