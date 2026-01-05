import { Settings } from 'lucide-react';

interface RightControlsProps {
    showMap: boolean;
    setShowMap: (val: boolean) => void;
    handleSettingsClick: (e: React.MouseEvent) => void;
}

export function RightControls({
    showMap,
    setShowMap,
    handleSettingsClick,
}: RightControlsProps) {
    return (
        <>
            {/* Botón de Ajustes */}
            <div className="pointer-events-auto absolute right-4 bottom-10/24 z-20 flex -translate-y-15/20 flex-col gap-2">
                <button
                    onClick={handleSettingsClick}
                    className="cursor-pointer rounded-full bg-black/80 p-2 text-white backdrop-blur-md transition-all duration-300 hover:bg-black/90"
                >
                    <Settings className="h-5 w-5" />
                </button>
            </div>

            {/* Switch de Map/Globe */}
            <label className="pointer-events-auto absolute top-23 right-20 z-20 mb-4 inline-flex cursor-pointer items-center">
                <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={showMap}
                    onChange={() => setShowMap(!showMap)}
                />
                <div className="h-8 w-14 rounded-full bg-gray-300 peer-checked:bg-blue-500 peer-focus:ring-2 peer-focus:ring-blue-300 before:absolute before:top-1 before:left-1 before:h-6 before:w-6 before:rounded-full before:bg-white before:transition-transform before:content-[''] peer-checked:before:translate-x-6"></div>
            </label>
        </>
    );
}
