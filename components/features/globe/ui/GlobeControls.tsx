/**
 * GlobeControls.tsx
 * Interfaz de usuario (HUD) para controlar la cámara del globo.
 * Incluye botones de zoom, reset y pausa de rotación.
 */
import { Button } from '@/components/ui/button';
import { GlobeControlsProps } from '@/lib/interfaces/globe.interface';
import { Plus, Minus, RotateCcw, Pause, Play } from 'lucide-react';

export function GlobeControls({
    onZoomIn,
    onZoomOut,
    onReset,
    isPaused,
    setIsPaused,
}: GlobeControlsProps) {
    return (
        <div className="absolute right-4 bottom-1/2 z-20 mt-24 flex translate-y-2/3 flex-col gap-3">
            <Button
                onClick={() => setIsPaused(!isPaused)}
                variant="control"
                size="icon-lg"
            >
                {isPaused ? (
                    <Play className="size-5" />
                ) : (
                    <Pause className="size-5" />
                )}
            </Button>
            <Button
                onClick={onZoomIn}
                variant="control"
                size="icon-lg"
                aria-label="Acercar"
            >
                <Plus className="size-5" />
            </Button>
            <Button
                onClick={onZoomOut}
                variant="control"
                size="icon-lg"
                aria-label="Alejar"
            >
                <Minus className="size-5" />
            </Button>
            <Button
                onClick={onReset}
                variant="control"
                size="icon-lg"
                aria-label="Reiniciar cámara"
            >
                <RotateCcw className="size-5" />
            </Button>
        </div>
    );
}
