import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useState } from 'react';
import { Globe } from './Globe';
import { GlobeMainProps } from '@/lib/interfaces/globe.interface';
import { useCameraControls } from '@/lib/hooks/useCameraControls';
import { GlobeControls } from './GlobeControls';
import ArticleModal from '@/components/shared/articles/ArticleModal';

export default function GlobeMain({
    filters,
    isPaused,
    setIsPaused,
    setIsModalOpen,
    settings,
    orbitControlsRef,
}: GlobeMainProps) {
    const { zoomIn, zoomOut, resetCamera, DEFAULT_CAMERA } = useCameraControls(
        orbitControlsRef as any
    );

    return (
        <>
            {settings.display.showCameraButtons && (
                <GlobeControls
                    onZoomIn={zoomIn}
                    onZoomOut={zoomOut}
                    onReset={resetCamera}
                    isPaused={isPaused}
                    setIsPaused={setIsPaused}
                />
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
                    filters={filters}
                    isPaused={isPaused}
                    settings={settings}
                    setIsModalOpen={setIsModalOpen}
                />
            </Canvas>
        </>
    );
}
