import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { ThreeEvent } from '@react-three/fiber';
import { useMarkerSize } from '@/lib/hooks/useMarkerSize';
import { ClusterPopup } from './ClusterPopup';
import { MarkerClusterProps } from '@/lib/interfaces/globe.interface';

function MarkerClusterBase({
    position,
    markers,
    onHover,
    cameraDistance = 3.5,
    setIsModalOpen,
}: MarkerClusterProps) {
    const [hovered, setHovered] = useState(false);
    const [clicked, setClicked] = useState(false);
    const sphereRef = useRef<THREE.Mesh>(null);
    const [popupPosition, setPopupPosition] = useState<'top' | 'bottom'>('top');

    // Usar hook para tamaño. Escalamos un poco más los clusters (1.3x)
    const markerSize = useMarkerSize(cameraDistance, 0.018, 1.3);
    // Tamaño para el badge de número, un poco más pequeño
    const informativeMarkerSize = useMarkerSize(cameraDistance, 0.018, 1.3);

    useEffect(() => {
        setPopupPosition(position[1] > 0 ? 'bottom' : 'top');
    }, [position]);

    // Cerrar al hacer clic fuera (si está abierto)
    useEffect(() => {
        const handleClickOutside = () => {
            if (clicked) {
                setClicked(false);
                setHovered(false);
                onHover(false);
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
    }, [clicked, onHover]);

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
                    <ClusterPopup
                        markers={markers}
                        onClose={() => {
                            setClicked(false);
                            setHovered(false);
                            onHover(false);
                        }}
                        onHover={onHover}
                        setIsModalOpen={setIsModalOpen}
                    />
                </Html>
            )}
        </group>
    );
}
export const MarkerCluster = memo(MarkerClusterBase);
