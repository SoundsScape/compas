import { Button } from '@/components/ui/button';
import { RightControlsProps } from '@/lib/interfaces/rightPanel.interface';
import { Settings } from 'lucide-react';

export function RightControls({
    showMap,
    setShowMap,
    handleSettingsClick,
}: RightControlsProps) {
    return (
        <div className="absolute top-20 right-4 z-20 flex flex-col items-end gap-2">
            {/* Switch de Map/Globe */}
            <label className="pointer-events-auto z-20 mb-4 inline-flex cursor-pointer items-center">
                <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={showMap}
                    onChange={() => setShowMap(!showMap)}
                />
                <div className="peer-checked:bg-primary/90 h-8 w-14 rounded-full bg-gray-400 peer-focus:ring-2 peer-focus:ring-blue-300 before:absolute before:top-1 before:left-1 before:h-6 before:w-6 before:rounded-full before:bg-white before:transition-transform before:content-[''] peer-checked:before:translate-x-6"></div>
            </label>
            {/* Botón de Ajustes */}
            <div className="pointer-events-auto z-20">
                <Button
                    onClick={handleSettingsClick}
                    variant="control"
                    size="icon-lg"
                >
                    <Settings className="size-5.5" />
                </Button>
            </div>
        </div>
    );
}
