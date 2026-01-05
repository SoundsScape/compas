import { X } from 'lucide-react';

export interface VisualSettings {
    rotationSpeed: number;
    showEffects: boolean;
    clusterThreshold?: number;
}

export interface DisplaySettings {
    dateFormat: 'AC/DC' | 'BCE/CE';
    showNavbar: boolean;
    showFilters: boolean;
    showTimeline: boolean;
    showCameraButtons: boolean;
}

export interface Settings {
    visual: VisualSettings;
    display: DisplaySettings;
}

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    settings: Settings;
    onSettingsChange: (newSettings: Settings) => void;
    buttonPosition: { x: number; y: number };
}

export function SettingsModal({
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
                className="absolute w-96 rounded-xl bg-[url(/fondo-inverted.png)] text-white shadow-xl"
                style={{
                    top: buttonPosition.y,
                    right: -300,
                    transform: 'translate(-100%, -50%)',
                    animation: 'fadeIn 0.2s ease-out',
                }}
                onClick={e => e.stopPropagation()}
            >
                <div className="flex flex-col gap-4 rounded-xl bg-black/80 p-6 backdrop-blur-md dark:bg-black">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white">
                            Configuración
                        </h2>
                        <button
                            onClick={onClose}
                            className="cursor-pointer rounded-full p-2 transition-colors hover:bg-white/10"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Ajustes del mundo */}
                    <section className="mb-8">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-300">
                                Configuración visual del mundo
                            </h3>
                            <button
                                onClick={handleResetVisualSettings}
                                className="cursor-pointer text-sm text-blue-500 transition-colors hover:text-blue-400"
                            >
                                Default
                            </button>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label
                                    htmlFor="rotationSpeed"
                                    className="mb-2 block text-sm text-gray-400"
                                >
                                    Velocidad de Rotación
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="0"
                                        max="0.005"
                                        step="0.0001"
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
                                        className="w-full cursor-pointer accent-blue-500"
                                    />
                                    <span className="w-12 text-sm text-gray-400">
                                        {settings.visual.rotationSpeed.toFixed(
                                            4
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Ajustes de visualización */}
                    <section className="mb-8">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-300">
                                Elementos Visibles
                            </h3>
                            <button
                                onClick={handleResetDisplaySettings}
                                className="cursor-pointer text-sm text-blue-500 transition-colors hover:text-blue-400"
                            >
                                Default
                            </button>
                        </div>
                        <div className="space-y-4 rounded-lg bg-white/5 p-4">
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
                                    className="h-4 w-4 cursor-pointer rounded accent-blue-500"
                                />
                                <label
                                    htmlFor="showNavbar"
                                    className="text-sm text-gray-300"
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
                                    className="h-4 w-4 cursor-pointer rounded accent-blue-500"
                                />
                                <label
                                    htmlFor="showFilters"
                                    className="text-sm text-gray-300"
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
                                    className="h-4 w-4 cursor-pointer rounded accent-blue-500"
                                />
                                <label
                                    htmlFor="showTimeline"
                                    className="text-sm text-gray-300"
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
                                    className="h-4 w-4 cursor-pointer rounded accent-blue-500"
                                />
                                <label
                                    htmlFor="showCameraButtons"
                                    className="text-sm text-gray-300"
                                >
                                    Botones de cámara
                                </label>
                            </div>
                            <div className="mt-4 flex items-center gap-3">
                                <span className="mr-2 text-sm text-gray-300">
                                    Formato de fechas:
                                </span>
                                <div className="flex gap-4">
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
                                            className="cursor-pointer accent-blue-500"
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
                                            className="cursor-pointer accent-blue-500"
                                        />
                                        <span className="text-sm text-gray-300">
                                            BCE/CE
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
