import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MusicNoteProps {
    initialPosition: [number, number, number];
}

export function MusicNote({ initialPosition }: MusicNoteProps) {
    const noteRef = useRef<THREE.Group>(null);
    const startTime = useRef(Date.now());
    const lifespan = 3000; // 3 segundos de vida
    const [texture] = useState(() => {
        const loader = new THREE.TextureLoader();
        return loader.load(
            'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Musical_note_nicu_bucule_01.svg/1200px-Musical_note_nicu_bucule_01.svg.png'
        );
    });

    useFrame(() => {
        if (noteRef.current) {
            // Movimiento flotante
            noteRef.current.position.y += 0.002;
            noteRef.current.rotation.y += 0.01;

            // Calcular opacidad basada en el tiempo de vida
            const age = Date.now() - startTime.current;
            const opacity = Math.max(0, 1 - age / lifespan);

            if (noteRef.current.children[0] instanceof THREE.Mesh) {
                const material = noteRef.current.children[0]
                    .material as THREE.MeshBasicMaterial;
                material.opacity = opacity;
            }
        }
    });

    useEffect(() => {
        if (noteRef.current) {
            // Ajustar la posición para que esté más cerca del planeta
            const direction = new THREE.Vector3(...initialPosition).normalize();
            const distance = 1.2; // Reducido de 1.5 a 1.2
            noteRef.current.position.set(
                direction.x * distance,
                direction.y * distance,
                direction.z * distance
            );
        }
    }, [initialPosition]);

    return (
        <group ref={noteRef}>
            <mesh>
                <planeGeometry args={[0.1, 0.1]} />
                <meshBasicMaterial
                    map={texture}
                    transparent
                    opacity={1}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </group>
    );
}
