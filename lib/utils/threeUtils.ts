import * as THREE from 'three';

/**
 * Convierte latitud y longitud a un Vector3 de Three.js (Coordenadas esféricas)
 */
export function latLngToVector3(
    lat: number,
    lng: number
): [number, number, number] {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    const x = -(Math.sin(phi) * Math.cos(theta));
    const z = Math.sin(phi) * Math.sin(theta);
    const y = Math.cos(phi);

    return [x, y, z];
}

/**
 * Calcula la distancia euclidiana entre dos puntos en el espacio 3D
 */
export function calculateDistance(
    pos1: [number, number, number],
    pos2: [number, number, number]
): number {
    return Math.sqrt(
        Math.pow(pos1[0] - pos2[0], 2) +
            Math.pow(pos1[1] - pos2[1], 2) +
            Math.pow(pos1[2] - pos2[2], 2)
    );
}

/**
 * Determina si un punto en el globo es visible desde la cámara
 */
export function isPointVisible(
    position: [number, number, number],
    globeMatrixWorld: THREE.Matrix4,
    cameraPosition: THREE.Vector3
): boolean {
    const worldPosition = new THREE.Vector3(...position);
    worldPosition.applyMatrix4(globeMatrixWorld);

    const centerToPoint = worldPosition.clone().normalize();
    const centerToCamera = cameraPosition.clone().normalize();

    return centerToPoint.dot(centerToCamera) > 0.1;
}
