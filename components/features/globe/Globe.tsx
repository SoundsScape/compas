'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { isPointVisible } from '@/lib/utils/threeUtils';
import { useArticles } from '@/lib/hooks/useArticles';
import { useGlobeTextures } from '@/lib/hooks/useGlobeTextures';
import { Earth } from './Earth';
import { Clouds } from './Clouds';
import { MarkersLayer } from './MarkersLayer';
import { GlobeProps } from '@/lib/interfaces/globe.interface';

export function Globe({ filters, isPaused, settings }: GlobeProps) {
    const globeRef = useRef<THREE.Group>(null);
    const cloudsRef = useRef<THREE.Mesh>(null);
    const [isHovered, setIsHovered] = useState(false);
    const rotationSpeedRef = useRef(settings.visual.rotationSpeed);
    const targetSpeedRef = useRef(settings.visual.rotationSpeed);
    const [loading, setLoading] = useState(true);
    const lastUpdateTimeRef = useRef(0);
    const { camera } = useThree();
    const [cameraDistance, setCameraDistance] = useState<number>(3.5);

    // 1. Cálculo del umbral dinámico (necesario para el hook)
    const dynamicClusterThreshold = useMemo(() => {
        const baseThreshold = settings.visual.clusterThreshold || 0.05;
        const minDistance = 1.4;
        const maxDistance = 5;
        // Cuando la cámara está cerca (zoom máximo), queremos el umbral más bajo (menos agrupamiento)
        // Cuando la cámara está lejos (zoom mínimo), queremos el umbral más alto (más agrupamiento)
        // Calcular factor de escala basado en la distancia (0 cuando está al máximo zoom, 1 cuando está al mínimo)
        const zoomFactor = Math.min(
            Math.max(
                (cameraDistance - minDistance) / (maxDistance - minDistance),
                0
            ),
            1
        );
        // Aplicar el factor a nuestro umbral, pero establecer un mínimo para que puntos muy cercanos
        // siempre se agrupen, incluso cuando estamos al máximo zoom
        const minThreshold = 0.009; // Umbral mínimo para agrupación
        return Math.max(minThreshold, baseThreshold * zoomFactor);
    }, [cameraDistance, settings.visual.clusterThreshold]);
    // 2. Hooks de Datos y Texturas
    const {
        clusterGroups,
        setClusterGroups,
        loading: articlesLoading,
    } = useArticles(filters, dynamicClusterThreshold);
    const { earthTexture, cloudsTexture, texturesLoaded } = useGlobeTextures();
    // 3. Efectos de Rotación
    useEffect(() => {
        targetSpeedRef.current =
            isHovered || isPaused ? 0 : settings.visual.rotationSpeed;
    }, [isHovered, isPaused, settings.visual.rotationSpeed]);
    // 4. Bucle de Animación
    useFrame(() => {
        if (!globeRef.current) return;

        // Rotación suave del globo
        rotationSpeedRef.current +=
            (targetSpeedRef.current - rotationSpeedRef.current) * 0.05;
        globeRef.current.rotation.y += rotationSpeedRef.current;
        // Tracking de cámara
        const newDist = camera.position.length();
        if (Math.abs(newDist - cameraDistance) > 0.01)
            setCameraDistance(newDist);
        // Actualización de visibilidad cada 100ms
        const currentTime = performance.now();
        if (currentTime - lastUpdateTimeRef.current > (isPaused ? 300 : 100)) {
            lastUpdateTimeRef.current = currentTime;
            const matrix = globeRef.current.matrixWorld;
            setClusterGroups(prev =>
                prev.map(g => ({
                    ...g,
                    isVisible: isPointVisible(
                        g.center,
                        matrix,
                        camera.position
                    ),
                }))
            );
        }
        if (cloudsRef.current) cloudsRef.current.rotation.y += 0.0001;
    });
    // 5. Gestión del Loading
    useEffect(() => {
        if (texturesLoaded && !articlesLoading) setLoading(false);
    }, [texturesLoaded, articlesLoading]);

    return (
        <>
            {loading ? (
                <Html center>
                    <div className="flex h-64 items-center justify-center">
                        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-white"></div>
                    </div>
                </Html>
            ) : (
                <>
                    <ambientLight intensity={8} />
                    <pointLight position={[10, 10, 10]} intensity={2} />

                    <group ref={globeRef}>
                        <Earth texture={earthTexture} />

                        {settings.visual.showEffects && (
                            <Clouds ref={cloudsRef} texture={cloudsTexture} />
                        )}
                        <MarkersLayer
                            clusterGroups={clusterGroups}
                            onHover={setIsHovered}
                            cameraDistance={cameraDistance}
                        />
                    </group>
                </>
            )}
        </>
    );
}
