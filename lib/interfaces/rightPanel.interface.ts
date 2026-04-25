export interface RightControlsProps {
    showMap: boolean;
    setShowMap: (val: boolean) => void;
    handleSettingsClick: (e: React.MouseEvent) => void;
}

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

export interface SettingsModalProps {
    isMap2d: boolean;
    isOpen: boolean;
    onClose: () => void;
    settings: Settings;
    onSettingsChange: (newSettings: Settings) => void;
    buttonPosition: { x: number; y: number };
}
