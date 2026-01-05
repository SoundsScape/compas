import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Globe } from './Globe';
import { Play, Pause, Plus, Minus, RotateCcw } from 'lucide-react';
import { Settings } from '../../sections/home/SettingsModal';
import { RefObject } from 'react';
import * as THREE from 'three';

// Configuración de cámara por defecto
const DEFAULT_CAMERA = {
    minDistance: 1.15,
    maxDistance: 5,
    initialDistance: 3.5,
};

interface GlobeMainProps {
    selectedYearRange: [number, number];
    filters: {
        search: string;
        yearRange: [number, number];
        categories: string[];
        eventTypes: string[];
        regions: string[];
    };
    isPaused: boolean;
    setIsPaused: (paused: boolean) => void;
    settings: Settings;
    orbitControlsRef: RefObject<{
        target: THREE.Vector3;
        object: THREE.Camera;
        getDistance: () => number;
        reset: () => void;
        minDistance: number;
        maxDistance: number;
    } | null>;
}

export default function GlobeMain({
    selectedYearRange,
    filters,
    isPaused,
    setIsPaused,
    settings,
    orbitControlsRef,
}: GlobeMainProps) {
    // Función para acercar la cámara
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

    // Función para alejar la cámara
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

    // Función para resetear la cámara
    const resetCamera = () => {
        if (orbitControlsRef.current) {
            const controls = orbitControlsRef.current;
            controls.reset();
            controls.minDistance = DEFAULT_CAMERA.minDistance;
            controls.maxDistance = DEFAULT_CAMERA.maxDistance;
        }
    };

    return (
        <>
            <div className="absolute top-[105px] right-4 z-20 flex -translate-y-2/5 flex-col gap-2">
                <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="cursor-pointer rounded-full bg-black/80 p-2 text-white backdrop-blur-md transition-all duration-300 hover:bg-black/90"
                >
                    {isPaused ? (
                        <Play className="h-5 w-5" />
                    ) : (
                        <Pause className="h-5 w-5" />
                    )}
                </button>
            </div>

            {settings.display.showCameraButtons && (
                <div className="absolute right-4 bottom-1/4 z-20 mt-24 flex -translate-y-1/4 flex-col gap-2">
                    <button
                        onClick={zoomIn}
                        className="cursor-pointer rounded-full bg-black/80 p-2 text-white backdrop-blur-md transition-all duration-300 hover:bg-black/90"
                    >
                        <Plus className="h-5 w-5" />
                    </button>
                    <button
                        onClick={zoomOut}
                        className="cursor-pointer rounded-full bg-black/80 p-2 text-white backdrop-blur-md transition-all duration-300 hover:bg-black/90"
                    >
                        <Minus className="h-5 w-5" />
                    </button>
                    <button
                        onClick={resetCamera}
                        className="cursor-pointer rounded-full bg-black/80 p-2 text-white backdrop-blur-md transition-all duration-300 hover:bg-black/90"
                    >
                        <RotateCcw className="h-5 w-5" />
                    </button>
                </div>
            )}

            <Canvas
                camera={{
                    position: [0, 0, DEFAULT_CAMERA.initialDistance],
                    fov: 45,
                }}
            >
                <OrbitControls
                    ref={orbitControlsRef as any}
                    enableZoom={true}
                    enablePan={false}
                    minDistance={DEFAULT_CAMERA.minDistance}
                    maxDistance={DEFAULT_CAMERA.maxDistance}
                    zoomSpeed={0.5}
                    minPolarAngle={0.1}
                    maxPolarAngle={Math.PI - 0.1}
                />
                <Globe
                    selectedYearRange={selectedYearRange}
                    filters={filters}
                    isPaused={isPaused}
                    settings={settings}
                />
            </Canvas>
        </>
    );
}
