import * as THREE from 'three';

export interface GlobeControls {
    target: THREE.Vector3;
    object: THREE.Camera;
    getDistance: () => number;
    reset: () => void;
    minDistance: number;
    maxDistance: number;
}
