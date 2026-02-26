/**
 * Earth.tsx
 * Representación 3D del planeta Tierra. 
 * Utiliza una esfera con una textura mapeada para mostrar el relieve y la geografía.
 */
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

export function Earth({ texture }: { texture: THREE.Texture }) {
    return (
        <Sphere args={[1, 64, 64]}>
            <meshStandardMaterial map={texture} />
        </Sphere>
    );
}
