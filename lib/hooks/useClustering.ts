import { useState, useEffect, RefObject } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ClusterGroup } from '@/lib/interfaces/globe.interface';
import { Article } from '@/lib/interfaces/article.interface';
import {
    latLngToVector3,
    calculateDistance,
    isPointVisible,
} from '@/lib/utils/threeUtils';

/**
 * Hook para gestionar la agrupación (clustering) de marcadores y su visibilidad inicial.
 * Devuelve el estado de los grupos y el setter para actualizaciones posteriores (ej. en useFrame).
 */
export function useClustering(
    articles: Article[],
    globeRef: RefObject<THREE.Group>,
    dynamicClusterThreshold: number
) {
    const { camera } = useThree();
    const [clusterGroups, setClusterGroups] = useState<ClusterGroup[]>([]);

    useEffect(() => {
        // Si no hay artículos, limpiamos grupos
        if (articles.length === 0) {
            setClusterGroups([]);
            return;
        }

        const eventPositions = articles.map(article => ({
            article,
            position: latLngToVector3(
                parseFloat(article.latitud),
                parseFloat(article.longitud)
            ),
        }));

        const groups: ClusterGroup[] = [];
        const processed = new Set<number>();

        // Algoritmo de agrupación
        eventPositions.forEach((event, idx) => {
            if (processed.has(idx)) return;

            const group: ClusterGroup = {
                center: event.position,
                markers: [event],
            };
            processed.add(idx);

            // Buscar vecinos
            eventPositions.forEach((otherEvent, otherIdx) => {
                if (idx === otherIdx || processed.has(otherIdx)) return;

                const distance = calculateDistance(
                    event.position,
                    otherEvent.position
                );

                if (distance < dynamicClusterThreshold) {
                    group.markers.push(otherEvent);
                    processed.add(otherIdx);
                }
            });

            // Visibilidad inicial
            if (globeRef.current) {
                const matrix = globeRef.current.matrixWorld;
                group.isVisible = isPointVisible(
                    group.center,
                    matrix,
                    camera.position
                );
            } else {
                group.isVisible = true;
            }

            groups.push(group);
        });

        setClusterGroups(groups);
    }, [articles, dynamicClusterThreshold, camera, globeRef]);

    return { clusterGroups, setClusterGroups };
}
