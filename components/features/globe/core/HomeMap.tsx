/**
 * HomeMap.tsx
 * Orquestador principal de la vista de mapa 2D (Leaflet).
 * Renderiza los artículos sobre una capa de satélite sincronizada con los filtros globales.
 */
'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { LatLngBoundsLiteral } from 'leaflet';
import L from 'leaflet';
import MapMarker from '../markers/MapMarker';
import { useArticles } from '@/lib/hooks/useArticles';
import { HomeMapProps } from '@/lib/interfaces/globe.interface';

// Solución para los iconos de Leaflet
if (typeof window !== 'undefined') {
    L.Icon.Default.mergeOptions({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl:
            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl:
            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
}

const MapContainer = dynamic(
    () => import('react-leaflet').then(mod => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import('react-leaflet').then(mod => mod.TileLayer),
    { ssr: false }
);

const bounds: LatLngBoundsLiteral = [
    [-90, -180], // Esquina suroeste
    [90, 180], // Esquina noreste
];

export default function HomeMap({
    filters,
    setIsModalOpen,
    dateFormat,
}: HomeMapProps) {
    const [mapReady, setMapReady] = useState(false);
    // Inyectamos los mismos datos que el Globo
    // Pasamos 0 como umbral de cluster porque el mapa 2D no los usa (por ahora)
    const { articles, loading } = useArticles(filters);

    // Detectar cuando el mapa está listo
    useEffect(() => {
        if (!loading) {
            const timer = setTimeout(() => {
                setMapReady(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [loading]);

    return (
        <div className="relative z-0 h-screen w-full">
            {loading ? (
                <div className="flex h-full w-full items-center justify-center">
                    <div className="flex flex-col items-center">
                        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-white"></div>
                    </div>
                </div>
            ) : (
                <MapContainer
                    center={[41.3874, 2.1686]} // Centro inicial del mapa
                    zoom={3}
                    minZoom={2.2}
                    maxZoom={20}
                    maxBounds={bounds}
                    style={{
                        height: '100vh',
                        width: '100%',
                        borderRadius: '8px',
                        overflow: 'hidden',
                    }}
                    worldCopyJump={false}
                    maxBoundsViscosity={1.0}
                    whenReady={() => setMapReady(true)}
                >
                    <TileLayer
                        // url="https://tile.openstreetmap.de/{z}/{x}/{y}.png"
                        // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        // Satellite (Esri World Imagery)
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        attribution="Tiles &copy; Esri"

                    // OSM Francia
                    // url='https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png'
                    // attribution='&copy; OpenStreetMap France'
                    />
                    {mapReady &&
                        articles.map((article, index) => (
                            <MapMarker
                                key={article.id}
                                article={article}
                                setIsModalOpen={setIsModalOpen}
                                dateFormat={dateFormat}
                            />
                        ))}
                </MapContainer>
            )}
        </div>
    );
}
