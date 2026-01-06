import { RefObject } from 'react';
import { GlobeControls as GlobeControlsType } from '@/lib/interfaces/globe.interface';

const DEFAULT_CAMERA = {
    minDistance: 1.15,
    maxDistance: 5,
    initialDistance: 3.5,
};

export function useCameraControls(
    orbitControlsRef: RefObject<GlobeControlsType | null>
) {
    const zoomIn = () => {
        if (orbitControlsRef.current) {
            const controls = orbitControlsRef.current;
            const currentDistance = controls.getDistance();
            const newDistance = Math.max(
                currentDistance - 0.5,
                DEFAULT_CAMERA.minDistance
            );

            controls.minDistance = Math.max(
                DEFAULT_CAMERA.minDistance,
                newDistance - 0.5
            );
            controls.maxDistance = Math.max(
                DEFAULT_CAMERA.minDistance + 1,
                newDistance + 0.5
            );

            // Use object position to set zoom level
            const direction = controls.object.position.clone().normalize();
            controls.object.position.copy(
                direction.multiplyScalar(newDistance)
            );
        }
    };

    const zoomOut = () => {
        if (orbitControlsRef.current) {
            const controls = orbitControlsRef.current;
            const currentDistance = controls.getDistance();
            const newDistance = Math.min(
                currentDistance + 0.5,
                DEFAULT_CAMERA.maxDistance
            );

            controls.minDistance = Math.max(
                DEFAULT_CAMERA.minDistance,
                newDistance - 0.5
            );
            controls.maxDistance = Math.min(
                DEFAULT_CAMERA.maxDistance,
                newDistance + 0.5
            );

            // Use object position to set zoom level
            const direction = controls.object.position.clone().normalize();
            controls.object.position.copy(
                direction.multiplyScalar(newDistance)
            );
        }
    };

    const resetCamera = () => {
        if (orbitControlsRef.current) {
            const controls = orbitControlsRef.current;
            controls.reset();
            controls.minDistance = DEFAULT_CAMERA.minDistance;
            controls.maxDistance = DEFAULT_CAMERA.maxDistance;
        }
    };

    return {
        zoomIn,
        zoomOut,
        resetCamera,
        DEFAULT_CAMERA,
    };
}
