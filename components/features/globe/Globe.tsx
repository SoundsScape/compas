'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { isPointVisible } from '@/lib/utils/threeUtils';
import { useArticles } from '@/lib/hooks/useArticles';
import { useGlobeTextures } from '@/lib/hooks/useGlobeTextures';
import { useClustering } from '@/lib/hooks/useClustering';
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

        const zoomFactor = Math.min(
            Math.max(
                (cameraDistance - minDistance) / (maxDistance - minDistance),
                0
            ),
            1
        );
        const minThreshold = 0.009; // Umbral mínimo para agrupación
        return Math.max(minThreshold, baseThreshold * zoomFactor);
    }, [cameraDistance, settings.visual.clusterThreshold]);

    // 2. Hooks de Datos y Texturas
    const { articles: filteredEvents, loading: articlesLoading } =
        useArticles(filters);
    const { earthTexture, cloudsTexture, texturesLoaded } = useGlobeTextures();

    // 3. Hook de Clustering y Visibilidad Inicial
    const { clusterGroups, setClusterGroups } = useClustering(
        filteredEvents,
        globeRef as React.RefObject<THREE.Group>,
        dynamicClusterThreshold
    );

    // 4. Efectos de Rotación
    useEffect(() => {
        targetSpeedRef.current =
            isHovered || isPaused ? 0 : settings.visual.rotationSpeed;
    }, [isHovered, isPaused, settings.visual.rotationSpeed]);

    // 5. Bucle de Animación
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

    // 6. Gestión del Loading
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
