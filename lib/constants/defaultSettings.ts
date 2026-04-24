import { Settings as SettingsType } from '@/lib/interfaces/rightPanel.interface';

export const DEFAULT_SETTINGS: SettingsType = {
    visual: {
        rotationSpeed: 0.00089,
        showEffects: true,
        clusterThreshold: 0.05,
    },
    display: {
        dateFormat: 'AC/DC',
        showNavbar: true,
        showFilters: true,
        showTimeline: true,
        showCameraButtons: true,
    },
};

export const MIN_SPEED = 0;
export const MAX_SPEED = 0.004;
export const STEP = 0.0001;