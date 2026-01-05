'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';
import { LocationMarker } from './LocationMarker';
import { getArticles } from '../../../lib/services/articleService';
import { Article } from '../../../lib/interfaces/article.interface';
import { DisplaySettings } from '../../sections/home/SettingsModal';
import { limitWords } from '../../../lib/utils/textUtils';
import { getHistoricalPeriod } from '../../../lib/utils/historicalPeriods';
import { MarkerCluster } from './MarkerCluster';

// Añadir interfaces para el agrupamiento
interface ClusterGroup {
    center: [number, number, number];
    markers: {
        article: Article;
        position: [number, number, number];
    }[];
    isVisible?: boolean;
}

interface GlobeProps {
    selectedYearRange: [number, number];
    filters: {
        search: string;
        yearRange: [number, number];
        categories: string[];
        eventTypes: string[];
        regions: string[];
    };
    isPaused: boolean;
    settings: {
        visual: {
            rotationSpeed: number;
            showEffects: boolean;
            clusterThreshold?: number;
        };
        display: DisplaySettings;
    };
}

export function Globe({
    selectedYearRange,
    filters,
    isPaused,
    settings,
}: GlobeProps) {
    const globeRef = useRef<THREE.Group>(null);
    const cloudsRef = useRef<THREE.Mesh>(null);
    const [isHovered, setIsHovered] = useState(false);
    const rotationSpeedRef = useRef(settings.visual.rotationSpeed);
    const targetSpeedRef = useRef(settings.visual.rotationSpeed);
    const [articles, setArticles] = useState<Article[]>([]);
    // Añadir estado para los grupos de marcadores
    const [clusterGroups, setClusterGroups] = useState<ClusterGroup[]>([]);

    // Estado para controlar la carga de texturas
    const [loading, setLoading] = useState(true);
    const [texturesLoaded, setTexturesLoaded] = useState(false);
    const [articlesLoaded, setArticlesLoaded] = useState(false);
    // Referencia al tiempo de la última actualización para optimizar
    const lastUpdateTimeRef = useRef(0);
    // Obtener la cámara para el cálculo de visibilidad
    const { camera } = useThree();
    // Estado para rastrear los marcadores visibles
    const [visibleMarkers, setVisibleMarkers] = useState<
        Record<string, boolean>
    >({});
    // Estado para guardar la distancia actual de la cámara
    const [cameraDistance, setCameraDistance] = useState<number>(3.5);

    // Calcular el umbral de agrupamiento dinámicamente basado en la distancia de la cámara
    const dynamicClusterThreshold = useMemo(() => {
        // Configuración base desde los ajustes
        const baseThreshold = settings.visual.clusterThreshold || 0.05;

        // Rangos de zoom actualizados según DEFAULT_CAMERA en GlobeMain.tsx
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

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const data = await getArticles();
                setArticles(data);
                setArticlesLoaded(true);
            } catch (error) {
                console.error('Error al cargar artículos:', error);
                setArticlesLoaded(true); // Set to true even on error to prevent infinite loading
            }
        };
        fetchArticles();
    }, []);

    const [earthTexture] = useState(() => {
        const loader = new THREE.TextureLoader();
        loader.manager.onLoad = () => {
            // Este callback se ejecuta cuando todas las texturas gestionadas por este loader se han cargado
            setTexturesLoaded(true);
        };
        return loader.load('/assets/images/earth/10k-earthmap.avif');
    });

    const [cloudsTexture] = useState(() => {
        const loader = new THREE.TextureLoader();
        return loader.load(
            '/assets/images/clouds/4k-earth_blue_marble_cloud_map__.webp'
        );
    });

    useEffect(() => {
        if (isHovered || isPaused) {
            targetSpeedRef.current = 0;
        } else {
            targetSpeedRef.current = settings.visual.rotationSpeed;
        }
    }, [isHovered, isPaused, settings.visual.rotationSpeed]);

    useEffect(() => {
        rotationSpeedRef.current = settings.visual.rotationSpeed;
        targetSpeedRef.current = settings.visual.rotationSpeed;
    }, [settings.visual.rotationSpeed]);

    // Función para obtener los eventos actuales basados en filtros
    const getCurrentEvents = () => {
        return articles.filter(article => {
            // Filtro por año
            const articleYear = article.fecha;
            if (
                articleYear < filters.yearRange[0] ||
                articleYear > filters.yearRange[1]
            ) {
                return false;
            }

            // Filtro por búsqueda de texto
            if (
                filters.search &&
                !article.titulo
                    .toLowerCase()
                    .includes(filters.search.toLowerCase()) &&
                !(article.templates?.[0]?.text_areas?.[0]?.content || '')
                    .toLowerCase()
                    .includes(filters.search.toLowerCase())
            ) {
                return false;
            }

            // Filtro por categoría (período histórico)
            if (
                filters.categories.length > 0 &&
                !filters.categories.includes(getHistoricalPeriod(article.fecha))
            ) {
                return false;
            }

            // Filtro por tipo de evento
            if (
                filters.eventTypes.length > 0 &&
                !(
                    article.templates &&
                    article.templates[0] &&
                    article.templates[0].type &&
                    filters.eventTypes.includes(article.templates[0].type)
                ) &&
                !(
                    article.tags &&
                    article.tags.some(tag =>
                        filters.eventTypes.includes(tag.name)
                    )
                )
            ) {
                return false;
            }

            // Filtro por región
            if (
                filters.regions.length > 0 &&
                !filters.regions.includes(article.centro)
            ) {
                return false;
            }

            return true;
        });
    };

    // Función para determinar si un punto está en el lado visible del globo
    const isPointVisible = (position: [number, number, number]): boolean => {
        if (!globeRef.current) return true;

        // Convertimos la posición del punto al sistema de coordenadas mundial
        const worldPosition = new THREE.Vector3(...position);
        worldPosition.applyMatrix4(globeRef.current.matrixWorld);

        // Vector desde el centro del globo al punto
        const centerToPoint = worldPosition.clone().normalize();

        // Vector desde el centro del globo a la cámara
        const centerToCamera = camera.position.clone().normalize();

        // Calculamos el producto escalar para determinar si el punto está en el lado visible
        return centerToPoint.dot(centerToCamera) > 0.1;
    };

    // Obtener eventos filtrados de manera optimizada
    const filteredEvents = useMemo(() => {
        return getCurrentEvents();
    }, [articles, filters]);

    // Función para agrupar marcadores cercanos y verificar su visibilidad
    const getClusteredMarkersWithVisibility = () => {
        const eventPositions = filteredEvents.map(article => ({
            article,
            position: latLngToVector3(
                parseFloat(article.latitud),
                parseFloat(article.longitud)
            ),
        }));

        const groups: ClusterGroup[] = [];
        const processed = new Set<number>();

        // Ya no omitimos la agrupación, siempre la realizamos con el umbral dinámico
        // que ahora tiene un valor mínimo para garantizar que puntos muy cercanos
        // siempre se agrupen

        // Procesar cada punto
        eventPositions.forEach((event, idx) => {
            if (processed.has(idx)) return;

            const group: ClusterGroup = {
                center: event.position,
                markers: [event],
            };

            processed.add(idx);

            // Buscar puntos cercanos
            eventPositions.forEach((otherEvent, otherIdx) => {
                if (idx === otherIdx || processed.has(otherIdx)) return;

                const distance = calculateDistance(
                    event.position,
                    otherEvent.position
                );

                // Usar el umbral dinámico que ahora tiene un mínimo garantizado
                if (distance < dynamicClusterThreshold) {
                    group.markers.push(otherEvent);
                    processed.add(otherIdx);
                }
            });

            // Comprobar visibilidad del grupo
            group.isVisible = isPointVisible(group.center);

            // Añadir el grupo a la lista
            groups.push(group);
        });

        return groups;
    };

    // Calcular distancia entre dos puntos en 3D
    const calculateDistance = (
        pos1: [number, number, number],
        pos2: [number, number, number]
    ): number => {
        return Math.sqrt(
            Math.pow(pos1[0] - pos2[0], 2) +
                Math.pow(pos1[1] - pos2[1], 2) +
                Math.pow(pos1[2] - pos2[2], 2)
        );
    };

    // Forzar actualización de visibilidad cuando cambian los filtros o el umbral dinámico
    useEffect(() => {
        // Actualizar grupos de marcadores con información de visibilidad
        const groupsWithVisibility = getClusteredMarkersWithVisibility();
        setClusterGroups(groupsWithVisibility);
    }, [filteredEvents, dynamicClusterThreshold]);

    useFrame(() => {
        if (globeRef.current) {
            const diff = targetSpeedRef.current - rotationSpeedRef.current;
            rotationSpeedRef.current += diff * 0.05;

            globeRef.current.rotation.y += rotationSpeedRef.current;

            // Actualizar la distancia de la cámara
            const newCameraDistance = camera.position.length();
            if (Math.abs(newCameraDistance - cameraDistance) > 0.01) {
                setCameraDistance(newCameraDistance);
            }

            // Actualizar visibilidad solo cada 100ms (10 veces por segundo) para mejorar rendimiento
            const currentTime = performance.now();

            // Actualizar cuando hay rotación O cuando está pausado pero ha pasado suficiente tiempo
            if (
                (rotationSpeedRef.current > 0.0001 &&
                    currentTime - lastUpdateTimeRef.current > 100) ||
                (isPaused && currentTime - lastUpdateTimeRef.current > 300)
            ) {
                lastUpdateTimeRef.current = currentTime;

                // Actualizar la visibilidad de todos los grupos
                setClusterGroups(prevGroups => {
                    return prevGroups.map(group => ({
                        ...group,
                        isVisible: isPointVisible(group.center),
                    }));
                });
            }
        }

        if (cloudsRef.current) {
            cloudsRef.current.rotation.y += 0.0001;
        }
    });

    // Update loading state when both textures and articles are loaded
    useEffect(() => {
        if (texturesLoaded && articlesLoaded) {
            setLoading(false);
        }
    }, [texturesLoaded, articlesLoaded]);

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
                        <Sphere args={[1, 64, 64]}>
                            <meshStandardMaterial map={earthTexture} />
                        </Sphere>

                        {settings.visual.showEffects && (
                            <Sphere ref={cloudsRef} args={[1.01, 64, 64]}>
                                <meshStandardMaterial
                                    map={cloudsTexture}
                                    transparent
                                    opacity={0.8}
                                />
                            </Sphere>
                        )}

                        {clusterGroups.map((group, index) => {
                            // Solo renderizar marcadores visibles
                            if (!group.isVisible) return null;

                            if (group.markers.length === 1) {
                                // Para un solo punto, mostrar el marcador normal
                                const marker = group.markers[0];
                                const article = marker.article;
                                const historicalPeriod = getHistoricalPeriod(
                                    article.fecha
                                );

                                return (
                                    <LocationMarker
                                        key={`${article.titulo}-${index}`}
                                        position={marker.position}
                                        name={article.titulo}
                                        description={limitWords(
                                            article.templates?.[0]
                                                ?.text_areas?.[0]?.content || ''
                                        )}
                                        onHover={setIsHovered}
                                        category={historicalPeriod}
                                        region={article.centro}
                                        year={article.fecha}
                                        tags={article.tags}
                                        autor={article.nombre_autor}
                                        apellidos={article.apellidos_autor}
                                        cameraDistance={cameraDistance}
                                        id={article.id}
                                    />
                                );
                            } else {
                                // Para un grupo de puntos, mostrar un marcador de cluster
                                return (
                                    <MarkerCluster
                                        key={`cluster-${index}`}
                                        position={group.center}
                                        markers={group.markers}
                                        onHover={setIsHovered}
                                        cameraDistance={cameraDistance}
                                    />
                                );
                            }
                        })}
                    </group>
                </>
            )}
        </>
    );
}

function latLngToVector3(lat: number, lng: number): [number, number, number] {
    // Convertir latitud y longitud a radianes
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    const x = -(Math.sin(phi) * Math.cos(theta));
    const z = Math.sin(phi) * Math.sin(theta);
    const y = Math.cos(phi);

    return [x, y, z];
}
