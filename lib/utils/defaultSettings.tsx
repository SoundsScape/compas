import { type Settings as SettingsType } from '@/components/sections/home/SettingsModal';

export const DEFAULT_SETTINGS: SettingsType = {
    visual: {
        rotationSpeed: 0.001,
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
