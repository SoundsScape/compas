import { useState, useEffect } from 'react';
import { Settings as SettingsType } from '@/lib/interfaces/rightPanel.interface';
import { DEFAULT_SETTINGS } from '@/lib/utils/defaultSettings';

export function useSettings() {
    const [settings, setSettings] = useState<SettingsType>(DEFAULT_SETTINGS);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const savedSettings = localStorage.getItem('globeSettings');
                if (savedSettings) {
                    const parsed = JSON.parse(savedSettings);
                    const newSettings: SettingsType = {
                        visual: {
                            rotationSpeed:
                                parsed?.visual?.rotationSpeed ??
                                DEFAULT_SETTINGS.visual.rotationSpeed,
                            showEffects:
                                parsed?.visual?.showEffects ??
                                DEFAULT_SETTINGS.visual.showEffects,
                            clusterThreshold:
                                parsed?.visual?.clusterThreshold ??
                                DEFAULT_SETTINGS.visual.clusterThreshold,
                        },
                        display: {
                            dateFormat:
                                parsed?.display?.dateFormat ??
                                DEFAULT_SETTINGS.display.dateFormat,
                            showNavbar:
                                parsed?.display?.showNavbar ??
                                DEFAULT_SETTINGS.display.showNavbar,
                            showFilters:
                                parsed?.display?.showFilters ??
                                DEFAULT_SETTINGS.display.showFilters,
                            showTimeline:
                                parsed?.display?.showTimeline ??
                                DEFAULT_SETTINGS.display.showTimeline,
                            showCameraButtons:
                                parsed?.display?.showCameraButtons ??
                                DEFAULT_SETTINGS.display.showCameraButtons,
                        },
                    };
                    setSettings(newSettings);
                }
            } catch (error) {
                console.error('Error loading settings:', error);
            }
        }
    }, []);

    const saveSettings = (newSettings: SettingsType) => {
        try {
            localStorage.setItem('globeSettings', JSON.stringify(newSettings));
            setSettings(newSettings);
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    };

    return { settings, setSettings, saveSettings };
}
