import { useMemo } from 'react';

/**
 * Hook para calcular el tamaño dinámico de los marcadores según la distancia de la cámara.
 * @param cameraDistance Distancia actual de la cámara al centro.
 * @param baseSize Tamaño base del marcador (por defecto 0.013 para marcadores individuales).
 * @param scaleMultiplier Multiplicador de escala al alejarse (zoomFactor).
 */
export function useMarkerSize(
    cameraDistance: number,
    baseSize: number = 0.013,
    scaleMultiplier: number = 2
) {
    return useMemo(() => {
        const minDistance = 1.4;
        const maxDistance = 5;

        // Calcular factor de zoom (0 a 1)
        // 0 = Cerca (minDistance)
        // 1 = Lejos (maxDistance)
        const zoomFactor = Math.min(
            Math.max(
                (cameraDistance - minDistance) / (maxDistance - minDistance),
                0
            ),
            1
        );

        // Lógica: Más pequeño al acercarse (zoom in), más grande al alejarse (zoom out)
        // para mantener la visibilidad.
        return baseSize * (0.3 + zoomFactor * scaleMultiplier);
    }, [cameraDistance, baseSize, scaleMultiplier]);
}
