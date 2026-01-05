'use client';

import ProtectedRoute from '@/components/shared/auth/ProtectedRoute';
import { useState, useRef } from 'react';
import { useSettings } from '@/lib/hooks/useSettings';
import { useFilters } from '@/lib/hooks/useFilters';
import { Navbar } from '@/components/layout/Navbar';
import dynamic from 'next/dynamic';
import { GlobeControls } from '@/lib/interfaces/globe.interface';
import { RightControls } from '@/components/sections/home/RightControls';
import { FiltersPanel } from '@/components/sections/home/FiltersPanel';

// Importaciones de componentes
// Al desactivar el SSR, se preveen fallos con librerías pesadas de mapas y 3D.

const GlobeMain = dynamic(
    () => import('@/components/features/globe/GlobeMain'),
    { ssr: false }
);
const HomeMap = dynamic(() => import('@/components/features/globe/map'), {
    ssr: false,
});
const Timeline = dynamic(() => import('@/components/sections/home/Timeline'), {
    ssr: false,
});
const Filters = dynamic(() => import('@/components/sections/home/Filters'), {
    ssr: false,
});
const SettingsModal = dynamic(
    () =>
        import('@/components/sections/home/SettingsModal').then(
            mod => mod.SettingsModal
        ),
    { ssr: false }
);

const MIN_YEAR = -35000;
const MAX_YEAR = parseInt(new Date().getFullYear().toLocaleString());

export default function Home() {
    // Custom hooks
    const { settings, setSettings, saveSettings } = useSettings();
    const { filters, setFilters, selectedYearRange, setSelectedYearRange } =
        useFilters(MIN_YEAR, MAX_YEAR);

    // Estados de UI puramente locales
    const [showFilters, setShowFilters] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [settingsButtonRef, setSettingsButtonRef] = useState<{
        x: number;
        y: number;
    }>({ x: 0, y: 0 });

    const orbitControlsRef = useRef<GlobeControls>(null);

    const handleSettingsClick = (e: React.MouseEvent) => {
        setSettingsButtonRef({ x: e.clientX, y: e.clientY });
        setShowSettings(true);
    };

    return (
        <ProtectedRoute>
            <div className="from-primary to-background relative h-screen w-full bg-radial from-5%">
                {showMap ? (
                    <HomeMap
                        selectedYearRange={selectedYearRange}
                        filters={filters}
                    />
                ) : (
                    <GlobeMain
                        selectedYearRange={selectedYearRange}
                        filters={filters}
                        isPaused={isPaused}
                        setIsPaused={setIsPaused}
                        settings={settings}
                        orbitControlsRef={orbitControlsRef}
                    />
                )}

                <div className="pointer-events-none absolute inset-0 z-10 flex flex-col">
                    {settings.display.showNavbar && (
                        <div className="pointer-events-auto">
                            <Navbar />
                        </div>
                    )}

                    {settings.display.showFilters && (
                        <FiltersPanel
                            filters={filters}
                            setFilters={setFilters}
                            setSelectedYearRange={setSelectedYearRange}
                            minYear={MIN_YEAR}
                            maxYear={MAX_YEAR}
                            showFilters={showFilters}
                            setShowFilters={setShowFilters}
                        />
                    )}

                    <RightControls
                        showMap={showMap}
                        setShowMap={setShowMap}
                        handleSettingsClick={handleSettingsClick}
                    />

                    {settings.display.showTimeline && (
                        <Timeline
                            selectedYearRange={selectedYearRange}
                            setSelectedYearRange={setSelectedYearRange}
                            minYear={MIN_YEAR}
                            maxYear={MAX_YEAR}
                            dateFormat={settings.display.dateFormat}
                        />
                    )}
                </div>

                <SettingsModal
                    isOpen={showSettings}
                    onClose={() => setShowSettings(false)}
                    settings={settings}
                    onSettingsChange={newSettings => {
                        setSettings(newSettings);
                        saveSettings(newSettings);
                    }}
                    buttonPosition={settingsButtonRef}
                />
            </div>
        </ProtectedRoute>
    );
}
