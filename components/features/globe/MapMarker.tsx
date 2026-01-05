'use client';

import { ExternalLink } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Article } from '@/lib/interfaces/article.interface';
import { limitWords } from '@/lib/utils/textUtils';
import { getHistoricalPeriod } from '@/lib/utils/historicalPeriods';

// Importaciones dinámicas para Leaflet (solo cliente)
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), {
    ssr: false,
});
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), {
    ssr: false,
});

const formatYear = (year: number) =>
    year < 0 ? `${Math.abs(year)} a.C.` : `${year} d.C.`;

export function MapMarker({ article }: { article: Article }) {
    const historicalPeriod = getHistoricalPeriod(article.fecha);

    return (
        <Marker
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
                    <span className="text-sm font-medium text-gray-500">
                        {formatYear(article.fecha)}
                    </span>
                </div>
                <p className="mb-3 text-sm text-gray-600">
                    {limitWords(
                        article.templates?.[0]?.text_areas?.[0]?.content || ''
                    )}
                </p>
                <div className="mb-3 flex flex-wrap gap-1">
                    <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-800">
                        {historicalPeriod}
                    </span>
                    {article.tags?.map((tag, idx) => (
                        <span
                            key={idx}
                            className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800"
                        >
                            {tag.name}
                        </span>
                    ))}
                </div>
                <div className="mb-3">
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
                        Autor: {article.nombre_autor} {article.apellidos_autor}
                    </span>
                </div>
                <a
                    href={`/articles/view/${article.id}`}
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                >
                    Ver más <ExternalLink className="h-4 w-4" />
                </a>
            </Popup>
        </Marker>
    );
}
