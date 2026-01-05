import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { LatLngBoundsLiteral } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { getArticles } from '../../../lib/services/articleService';
import { Article } from '../../../lib/interfaces/article.interface';
import { limitWords } from '../../../lib/utils/textUtils';
import { getHistoricalPeriod } from '../../../lib/utils/historicalPeriods';

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
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), {
    ssr: false,
});
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), {
    ssr: false,
});

interface HomeMapProps {
    selectedYearRange: [number, number];
    filters: {
        search: string;
        yearRange: [number, number];
        categories: string[];
        eventTypes: string[];
        regions: string[];
    };
}

const bounds: LatLngBoundsLiteral = [
    [-90, -180], // Esquina suroeste
    [90, 180], // Esquina noreste
];

const formatYear = (year: number) => {
    if (year < 0) {
        return `${Math.abs(year)} a.C.`;
    }
    return `${year} d.C.`;
};

export default function HomeMap({ selectedYearRange, filters }: HomeMapProps) {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [mapReady, setMapReady] = useState(false);

    // Cargar artículos desde la base de datos
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const data = await getArticles();
                setArticles(data);
                setLoading(false);
            } catch (error) {
                console.error('Error al cargar artículos:', error);
                setLoading(false);
            }
        };
        fetchArticles();
    }, []);

    // Detectar cuando el mapa está listo
    useEffect(() => {
        if (!loading) {
            // Agregamos un pequeño retraso para asegurar que el mapa tenga tiempo de cargarse
            const timer = setTimeout(() => {
                setMapReady(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [loading]);

    // Filtrar eventos según los criterios
    const getCurrentEvents = () => {
        return articles.filter(article => {
            // Filtrar por rango de años
            if (
                article.fecha < selectedYearRange[0] ||
                article.fecha > selectedYearRange[1]
            ) {
                return false;
            }

            // Filtro por búsqueda
            if (
                filters.search &&
                !article.titulo
                    .toLowerCase()
                    .includes(filters.search.toLowerCase())
            ) {
                return false;
            }

            // Obtener la etapa histórica del artículo
            const historicalPeriod = getHistoricalPeriod(article.fecha);

            // Filtro por categorías (etapas históricas)
            if (filters.categories.length > 0) {
                if (!filters.categories.includes(historicalPeriod)) {
                    return false;
                }
            }
            // Filtro por tipos de eventos (tags)
            if (
                filters.eventTypes.length > 0 &&
                (!article.tags ||
                    !article.tags.some(tag =>
                        filters.eventTypes.includes(tag.name)
                    ))
            ) {
                return false;
            }

            // // Filtro por regiones
            // if (filters.regions.length > 0 && !filters.regions.includes(article.centro)) {
            //     return false;
            // }

            return true;
        });
    };

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
                        url="https://tile.openstreetmap.de/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        minZoom={1}
                        maxZoom={18}
                    />

                    {mapReady &&
                        getCurrentEvents().map((article, index) => {
                            // Obtener la etapa histórica del artículo
                            const historicalPeriod = getHistoricalPeriod(
                                article.fecha
                            );

                            return (
                                <Marker
                                    key={`${article.id}-${index}`}
                                    position={[
                                        parseFloat(article.latitud),
                                        parseFloat(article.longitud),
                                    ]}
                                >
                                    <Popup>
                                        <div className="mb-2 flex items-start justify-between">
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {article.titulo}
                                            </h3>
                                            <span className="text-gray-00 text-sm font-medium">
                                                {formatYear(article.fecha)}
                                            </span>
                                        </div>
                                        <p className="mb-3 text-sm text-gray-600">
                                            {limitWords(
                                                article.templates?.[0]
                                                    ?.text_areas?.[0]
                                                    ?.content || ''
                                            )}
                                        </p>
                                        <div className="mb-3 flex flex-wrap gap-1">
                                            <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-800">
                                                {historicalPeriod}
                                            </span>
                                            {article.tags &&
                                                article.tags.length > 0 && (
                                                    <>
                                                        {article.tags.map(
                                                            (tag, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800"
                                                                >
                                                                    {tag.name}
                                                                </span>
                                                            )
                                                        )}
                                                    </>
                                                )}
                                        </div>
                                        <div className="mb-3">
                                            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
                                                Autor: {article.nombre_autor}{' '}
                                                {article.apellidos_autor}
                                            </span>
                                        </div>
                                        <span className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800">
                                            <a
                                                href={`/articles/view/${article.id}`}
                                            >
                                                Ver más{' '}
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        </span>
                                    </Popup>
                                </Marker>
                            );
                        })}
                </MapContainer>
            )}
        </div>
    );
}
