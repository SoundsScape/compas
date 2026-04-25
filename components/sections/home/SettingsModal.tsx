import { SettingsModalProps, Settings } from '@/lib/interfaces/rightPanel.interface';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MIN_SPEED, MAX_SPEED, STEP } from '@/lib/constants/defaultSettings';

export function SettingsModal({
    isMap2d,
    isOpen,
    onClose,
    settings,
    onSettingsChange,
    buttonPosition,
}: SettingsModalProps) {
    if (!isOpen) return null;

    const handleResetVisualSettings = () => {
        onSettingsChange({
            ...settings,
            visual: {
                rotationSpeed: 0.001,
                showEffects: true,
            },
        });
    };

    const handleResetDisplaySettings = () => {
        onSettingsChange({
            ...settings,
            display: {
                dateFormat: 'AC/DC',
                showNavbar: true,
                showFilters: true,
                showTimeline: true,
                showCameraButtons: true,
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50" onClick={onClose}>
            <div
                className="absolute w-72 rounded-md text-white shadow-xl"
                style={{
                    top: buttonPosition.y,
                    right: 80,
                    transform: 'translate(0, -5%)',
                    animation: 'fadeIn 0.2s ease-out',
                }}
                onClick={e => e.stopPropagation()}
            >
                <div className="bg-background/80 pointer-events-auto flex flex-col overflow-y-auto rounded-md border shadow-lg backdrop-blur-md">
                    <div className="bg-linear-to-br from-primary to-secondary flex shrink-0 items-center justify-between border-b pl-4 pr-1.5 py-1">
                        <span className="text-md font-semibold">
                            Configuración
                        </span>
                        <Button
                            onClick={onClose}
                            variant="ghost"
                            size="icon-sm"
                        >
                            <X className="size-5" />
                        </Button>
                    </div>
                    <div className="bg-primary/30 flex min-h-0 flex-1 flex-col gap-3 p-4 space-y-3">
                        {/* Ajustes del mundo */}
                        <section className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs uppercase font-semibold">
                                    Globo terrestre
                                </h3>
                                <Button
                                    variant="link"
                                    size="sm"
                                    onClick={handleResetVisualSettings}
                                    className="text-primary-foreground/90 h-6 cursor-pointer px-2 text-xs hover:text-accent hover:underline"
                                >
                                    Default
                                </Button>
                            </div>

                            <div
                                className={`${isMap2d ? 'opacity-35 select-none pointer-events-none' : 'opacity-100'}`}
                            >
                                <label
                                    htmlFor="rotationSpeed"
                                    className="mb-2 block text-sm text-muted-foreground"
                                >
                                    Velocidad de Rotación
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min={MIN_SPEED}
                                        max={MAX_SPEED}
                                        step={STEP}
                                        disabled={isMap2d}
                                        value={settings.visual.rotationSpeed}
                                        onChange={e =>
                                            onSettingsChange({
                                                ...settings,
                                                visual: {
                                                    ...settings.visual,
                                                    rotationSpeed: parseFloat(
                                                        e.target.value
                                                    ),
                                                },
                                            })
                                        }
                                        className={`w-full accent-accent/80 ${isMap2d ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                    />
                                    <span className="w-12 text-xs text-muted-foreground font-mono">
                                        {settings.visual.rotationSpeed.toFixed(
                                            4
                                        )}
                                    </span>
                                </div>
                            </div>
                        </section>

                        {/* Ajustes de visualización */}
                        <section>
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="text-xs uppercase font-semibold">
                                    Elementos Visibles
                                </h3>
                                <Button
                                    variant="link"
                                    size="sm"
                                    onClick={handleResetDisplaySettings}
                                    className="text-primary-foreground/90 h-6 cursor-pointer px-2 text-xs hover:text-accent hover:underline"
                                >
                                    Default
                                </Button>
                            </div>
                            <div className="space-y-2 rounded-md bg-background/50 p-3">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="showNavbar"
                                        checked={settings.display.showNavbar}
                                        onChange={e =>
                                            onSettingsChange({
                                                ...settings,
                                                display: {
                                                    ...settings.display,
                                                    showNavbar: e.target.checked,
                                                },
                                            })
                                        }
                                        className="h-4 w-4 cursor-pointer rounded accent-accent/80"
                                    />
                                    <label
                                        htmlFor="showNavbar"
                                        className="text-sm text-muted-foreground"
                                    >
                                        Barra de navegación
                                    </label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="showFilters"
                                        checked={settings.display.showFilters}
                                        onChange={e =>
                                            onSettingsChange({
                                                ...settings,
                                                display: {
                                                    ...settings.display,
                                                    showFilters: e.target.checked,
                                                },
                                            })
                                        }
                                        className="h-4 w-4 cursor-pointer rounded accent-accent/80"
                                    />
                                    <label
                                        htmlFor="showFilters"
                                        className="text-sm text-muted-foreground"
                                    >
                                        Panel de filtros
                                    </label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="showTimeline"
                                        checked={settings.display.showTimeline}
                                        onChange={e =>
                                            onSettingsChange({
                                                ...settings,
                                                display: {
                                                    ...settings.display,
                                                    showTimeline: e.target.checked,
                                                },
                                            })
                                        }
                                        className="h-4 w-4 cursor-pointer rounded accent-accent/80"
                                    />
                                    <label
                                        htmlFor="showTimeline"
                                        className="text-sm text-muted-foreground"
                                    >
                                        Línea de tiempo
                                    </label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="showCameraButtons"
                                        checked={settings.display.showCameraButtons}
                                        onChange={e =>
                                            onSettingsChange({
                                                ...settings,
                                                display: {
                                                    ...settings.display,
                                                    showCameraButtons:
                                                        e.target.checked,
                                                },
                                            })
                                        }
                                        className="h-4 w-4 cursor-pointer rounded accent-accent/80"
                                    />
                                    <label
                                        htmlFor="showCameraButtons"
                                        className="text-sm text-gray-300"
                                    >
                                        Botones de cámara
                                    </label>
                                </div>
                            </div>
                        </section>

                        {/* Ajustes de visualización */}
                        <section>
                            <span className="text-xs uppercase font-semibold">
                                Formato de fechas
                            </span>
                            <div className="flex gap-4 bg-background/50 p-3 rounded-md mt-2">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="dateFormat"
                                        checked={
                                            settings.display.dateFormat ===
                                            'AC/DC'
                                        }
                                        onChange={() =>
                                            onSettingsChange({
                                                ...settings,
                                                display: {
                                                    ...settings.display,
                                                    dateFormat: 'AC/DC',
                                                },
                                            })
                                        }
                                        className="cursor-pointer accent-accent/80"
                                    />
                                    <span className="text-sm text-gray-300">
                                        a.C./d.C.
                                    </span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="dateFormat"
                                        checked={
                                            settings.display.dateFormat ===
                                            'BCE/CE'
                                        }
                                        onChange={() =>
                                            onSettingsChange({
                                                ...settings,
                                                display: {
                                                    ...settings.display,
                                                    dateFormat: 'BCE/CE',
                                                },
                                            })
                                        }
                                        className="cursor-pointer accent-accent"
                                    />
                                    <span className="text-sm text-muted-foreground">
                                        BCE/CE
                                    </span>
                                </label>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
