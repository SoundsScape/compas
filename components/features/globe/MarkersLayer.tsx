'use client';

import { LocationMarker } from './LocationMarker';
import { MarkerCluster } from './MarkerCluster';
import { getHistoricalPeriod } from '@/lib/utils/historicalPeriods';
import { limitWords } from '@/lib/utils/textUtils';
import { MarkersLayerProps } from '@/lib/interfaces/globe.interface';

export function MarkersLayer({
    clusterGroups,
    onHover,
    cameraDistance,
    setIsModalOpen,
}: MarkersLayerProps) {
    return (
        <>
            {clusterGroups.map((group, index) => {
                // Solo renderizar marcadores visibles
                if (!group.isVisible) return null;

                if (group.markers.length === 1) {
                    // Para un solo punto, mostrar el marcador normal
                    const marker = group.markers[0];
                    const article = marker.article;
                    const historicalPeriod = getHistoricalPeriod(article.fecha);

                    return (
                        <LocationMarker
                            key={`${article.titulo}-${index}`}
                            position={marker.position}
                            name={article.titulo}
                            description={limitWords(
                                article.templates?.[0]?.text_areas?.[0]
                                    ?.content || ''
                            )}
                            onHover={onHover}
                            category={historicalPeriod}
                            region={article.centro}
                            year={article.fecha}
                            tags={article.tags}
                            autor={article.nombre_autor}
                            apellidos={article.apellidos_autor}
                            cameraDistance={cameraDistance}
                            id={article.id}
                            setIsModalOpen={setIsModalOpen}
                        />
                    );
                } else {
                    // Para un grupo de puntos, mostrar un marcador de cluster
                    return (
                        <MarkerCluster
                            key={`cluster-${index}`}
                            position={group.center}
                            markers={group.markers}
                            onHover={onHover}
                            cameraDistance={cameraDistance}
                            setIsModalOpen={setIsModalOpen}
                        />
                    );
                }
            })}
        </>
    );
}
