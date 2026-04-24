import { useEffect, useRef, useState } from 'react';
import { API_CONFIG } from '@/lib/config/api.config';
import {
    Article,
    ArticleModalProps,
    Template,
} from '@/lib/interfaces/article.interface';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { ArticleTemplate } from './ArticleTemplate';

export default function ArticleModal({
    isModalOpen,
    setIsModalOpen,
}: ArticleModalProps) {
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const articleElement = useRef<HTMLElement | null>(null);

    // Efecto 1: Cuando el modal se abre, leer sessionStorage y hacer fetch
    useEffect(() => {
        if (!isModalOpen) return;

        const controller = new AbortController();
        const storedId = sessionStorage.getItem('articleId');

        setIsVisible(true);
        setLoading(true);
        setError(null);
        setArticle(null);

        if (!storedId) {
            setLoading(false);
            setError('No se pudo identificar el articulo seleccionado.');
            return;
        }

        sessionStorage.removeItem('articleId');
        const token = localStorage.getItem('token');

        fetch(
            `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.articles}/${storedId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                signal: controller.signal,
            }
        )
            .then(res => {
                if (!res.ok) {
                    throw new Error('Error al obtener el articulo');
                }
                return res.json();
            })
            .then((data: Article) => {
                const sortedArticle: Article = {
                    ...data,
                    templates: (data.templates ?? [])
                        .map((template: Template) => ({
                            ...template,
                            text_areas: [...template.text_areas].sort(
                                (a, b) => a.order - b.order
                            ),
                            image_areas: [...template.image_areas].sort(
                                (a, b) => a.order - b.order
                            ),
                        }))
                        .sort((a, b) => a.order - b.order),
                };
                setArticle(sortedArticle);
            })
            .catch(err => {
                if (err.name !== 'AbortError') {
                    setError('No se pudo cargar el articulo. Intentalo de nuevo.');
                }
            })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, [isModalOpen]);

    const handleDownloadArticle = (_articleHtml: HTMLElement) => {
        window.print();
    };

    if (!isModalOpen) return null;

    return (
        <div
            className={`scrollbar-hide fixed inset-0 z-999 overflow-y-auto bg-black py-20 transition-opacity duration-300 print:h-auto print:min-h-screen print:py-0 ${isVisible ? 'opacity-100' : 'opacity-0'
                }`}
        >
            <div className="from-secondary via-primary fixed top-0 left-0 flex w-full justify-between bg-linear-to-b to-black px-6 py-3 print:hidden print:py-0">
                <Button
                    onClick={() => {
                        if (articleElement.current && article) {
                            handleDownloadArticle(articleElement.current);
                        }
                    }}
                    disabled={!article || loading}
                    className="bg-accent hover:bg-accent z-999 w-40 text-gray-900 shadow transition-transform hover:translate-x-1 hover:scale-105 active:scale-95"
                >
                    Descargar PDF
                </Button>
                <Button
                    variant="link"
                    className="text-white"
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(() => {
                            setIsModalOpen(false);
                            setArticle(null);
                            setError(null);
                        }, 300);
                    }}
                >
                    <X />
                    Cerrar
                </Button>
            </div>
            {loading && (
                <div className="mx-auto mt-20 flex w-[210mm] max-w-full items-center justify-center rounded-md bg-white p-10 text-gray-700 shadow">
                    Cargando articulo...
                </div>
            )}

            {!loading && error && (
                <div className="mx-auto mt-20 flex w-[210mm] max-w-full items-center justify-center rounded-md bg-white p-10 text-red-700 shadow">
                    {error}
                </div>
            )}

            {!loading && !error && article && (
                <article
                    ref={articleElement}
                    className="mx-auto flex w-[210mm] max-w-full flex-col gap-10 bg-white p-[20mm] text-gray-900 print:w-full print:p-0"
                >
                    <h1 className="text-center text-4xl print:text-[24pt]">
                        {article.titulo}
                    </h1>
                    <section className="flex justify-between text-sm print:text-[11pt]">
                        <h3>
                            Un artículo creado por: <br />{' '}
                            <strong>
                                {article.apellidos_autor}, {article.nombre_autor}
                            </strong>
                        </h3>
                        <h3>
                            Del centro: <br /> <strong>{article.centro}</strong>
                        </h3>
                        <h3>
                            A fecha de: <br />{' '}
                            <strong>
                                {article.created_at
                                    ? new Intl.DateTimeFormat('es-ES', {
                                        dateStyle: 'long',
                                    }).format(new Date(article.created_at))
                                    : ''}
                            </strong>
                        </h3>
                    </section>

                    <section className="flex flex-col gap-8 print:gap-4">
                        {article.templates?.map(template => (
                            <ArticleTemplate key={template.id} {...template} />
                        ))}
                    </section>
                    <section className="flex flex-col gap-8 print:gap-4">
                        <h2 className="text-3xl font-bold print:text-[18pt]">
                            Bibliografía
                        </h2>
                        <ul className="w-full overflow-hidden text-sm print:text-[11pt]">
                            {article.bibliografia
                                .split('\n')
                                .map((line, i, arr) => {
                                    if (!line) return null;
                                    const isLink = line
                                        .trim()
                                        .startsWith('http');
                                    return (
                                        <li key={i}>
                                            {isLink ? (
                                                <a
                                                    href={line}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {line}
                                                    {i < arr.length - 1 && (
                                                        <br />
                                                    )}
                                                </a>
                                            ) : (
                                                <p>
                                                    {line}
                                                    {i < arr.length - 1 && (
                                                        <br />
                                                    )}
                                                </p>
                                            )}
                                        </li>
                                    );
                                })}
                        </ul>
                    </section>
                </article>
            )}
        </div>
    );
}
