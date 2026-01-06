import dynamic from 'next/dynamic';
import { Article } from '@/lib/interfaces/article.interface';
import { ArticleCardInfo } from './ArticleCardInfo';

// Importaciones dinámicas para Leaflet (solo cliente)
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), {
    ssr: false,
});
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), {
    ssr: false,
});

export function MapMarker({ article }: { article: Article }) {
    return (
        <Marker
            position={[
                parseFloat(article.latitud),
                parseFloat(article.longitud),
            ]}
        >
            <Popup>
                <div className="mt-13 w-64 border-t border-gray-200 pt-3">
                    <ArticleCardInfo article={article} descriptionLimit={10} />
                </div>
            </Popup>
        </Marker>
    );
}
