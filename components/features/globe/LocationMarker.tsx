import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { ArticlePopup } from './ArticlePopup';
import { useMarkerSize } from '@/lib/hooks/useMarkerSize';
import { Article } from '@/lib/interfaces/article.interface';
import { LocationMarkerProps } from '@/lib/interfaces/globe.interface';

function LocationMarkerBase({
    position,
    name,
    description,
    onHover,
    region,
    year,
    tags = [],
    autor,
    apellidos,
    cameraDistance = 3.5,
    id,
    setIsModalOpen,
}: LocationMarkerProps) {
    const [hovered, setHovered] = useState(false);
    const [clicked, setClicked] = useState(false);
    const sphereRef = useRef<THREE.Mesh>(null);
    const [popupPosition, setPopupPosition] = useState<'top' | 'bottom'>('top');
    // Usar el nuevo hook para el tamaño
    const markerSize = useMarkerSize(cameraDistance);

    useEffect(() => {
        setPopupPosition(position[1] > 0 ? 'bottom' : 'top');
    }, [position]);

    // Cerrar al hacer clic fuera
    useEffect(() => {
        const handleClickOuside = () => {
            if (clicked) {
                setClicked(false);
                setHovered(false);
                onHover(false);
            }
        };

        if (clicked) {
            // Usamos un timeout pequeño para evitar que el click que abre el popup lo cierre inmediatamente
            setTimeout(
                () => document.addEventListener('click', handleClickOuside),
                0
            );
        }

        return () => document.removeEventListener('click', handleClickOuside);
    }, [clicked, onHover]);

    interface ThreeEvent extends THREE.Event {
        stopPropagation?: () => void;
    }

    const handlePointerOver = useCallback(
        (e: ThreeEvent) => {
            e.stopPropagation?.();
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

    const handleClose = useCallback(() => {
        setClicked(false);
        setHovered(false);
        onHover(false);
    }, [onHover]);

    const handleOpenModal = useCallback(() => {
        setIsModalOpen(true);
        handleClose();
    }, [handleClose]);

    // Reconstruimos el objeto Article para pasárselo al popup compartido
    // (Idealmente refactorizaríamos MarkersLayer para pasar el Article completo)
    const articleData: Article = {
        id,
        titulo: name,
        fecha: year,
        latitud: String(position[0]), // Aproximación
        longitud: String(position[1]), // Aproximación
        centro: region,
        nombre_autor: autor,
        apellidos_autor: apellidos,
        templates: [{ text_areas: [{ content: description }] }],
        tags: tags,
    } as any;

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
                    <ArticlePopup
                        article={articleData}
                        onClose={handleClose}
                        onOpenModal={handleOpenModal}
                    />
                </Html>
            )}
        </group>
    );
}

export const LocationMarker = memo(LocationMarkerBase);
