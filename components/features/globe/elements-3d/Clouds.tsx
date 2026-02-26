/**
 * Clouds.tsx
 * Capa atmosférica de nubes en 3D.
 * Se renderiza sobre la Tierra con transparencia y una rotación independiente.
 */
import { forwardRef } from 'react';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

export const Clouds = forwardRef<THREE.Mesh, { texture: THREE.Texture }>(
    ({ texture }, ref) => (
        <Sphere ref={ref} args={[1.01, 64, 64]}>
            <meshStandardMaterial map={texture} transparent opacity={0.8} />
        </Sphere>
    )
);
