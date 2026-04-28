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
import ArticleModal from '@/components/shared/articles/ArticleModal';
import { TimelinePanel } from '@/components/sections/home/TimelinePanel';
import { MAX_YEAR, MIN_YEAR } from '@/lib/constants/yearsRange';

// Importaciones de componentes
// Al desactivar el SSR, se preveen fallos con librerías pesadas de mapas y 3D.
const GlobeMain = dynamic(
    () => import('@/components/features/globe/core/GlobeMain'),
    { ssr: false }
);
const HomeMap = dynamic(
    () => import('@/components/features/globe/core/HomeMap'),
    {
        ssr: false,
    }
);

const SettingsModal = dynamic(
    () =>
        import('@/components/sections/home/SettingsModal').then(
            mod => mod.SettingsModal
        ),
    { ssr: false }
);

export default function Home() {
    // Custom hooks
    const { settings, setSettings, saveSettings } = useSettings();
    const { filters, setFilters, selectedYearRange, setSelectedYearRange } =
        useFilters(MIN_YEAR, MAX_YEAR);

    // Estados de UI puramente locales
    const [showFilters, setShowFilters] = useState(false);
    const [showTimeline, setShowTimeline] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
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
            <div className={`from-primary to-background relative h-screen w-full bg-radial to-65% transition-all duration-300
                    ${showTimeline ? 'mt-8':'mt-8 xl:mt-0'}
                `}>
                {showMap ? (
                    <HomeMap
                        filters={filters}
                        setIsModalOpen={setIsModalOpen}
                        dateFormat={settings.display.dateFormat as any}
                    />
                ) : (
                    <GlobeMain
                        selectedYearRange={selectedYearRange}
                        filters={filters}
                        isPaused={isPaused}
                        setIsPaused={setIsPaused}
                        setIsModalOpen={setIsModalOpen}
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
                            showFilters={showFilters}
                            setShowFilters={setShowFilters}
                            dateFormat={settings.display.dateFormat as any}
                        />
                    )}

                    <RightControls
                        showMap={showMap}
                        setShowMap={setShowMap}
                        handleSettingsClick={handleSettingsClick}
                    />

                    {settings.display.showTimeline && (
                        <TimelinePanel
                            selectedYearRange={selectedYearRange}
                            setSelectedYearRange={setSelectedYearRange}
                            dateFormat={settings.display.dateFormat as any}
                            showTimeline={showTimeline}
                            setShowTimeline={setShowTimeline}
                        />
                    )}
                </div>

                <SettingsModal
                    isMap2d={showMap}
                    isOpen={showSettings}
                    onClose={() => setShowSettings(false)}
                    settings={settings}
                    onSettingsChange={newSettings => {
                        setSettings(newSettings);
                        saveSettings(newSettings);
                    }}
                    buttonPosition={settingsButtonRef}
                />

                <ArticleModal
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                />
            </div>
        </ProtectedRoute>
    );
}
