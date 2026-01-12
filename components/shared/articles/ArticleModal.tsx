import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { API_CONFIG } from '@/lib/config/api.config';
import {
    Article,
    ArticleModalProps,
    Template,
} from '@/lib/interfaces/article.interface';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export default function ArticleModal({
    isModalOpen,
    setIsModalOpen,
}: ArticleModalProps) {
    const [article, setArticle] = useState<Article | null>();
    const [_loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const articleElement = useRef(null);

    // Efecto 1: Cuando el modal se abre, leer sessionStorage y hacer fetch
    useEffect(() => {
        if (isModalOpen) {
            const storedId = sessionStorage.getItem('articleId');

            if (storedId) {
                setLoading(true);
                sessionStorage.removeItem('articleId');
                const token = localStorage.getItem('token');

                fetch(
                    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.articles}/${storedId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                )
                    .then(res => res.json())
                    .then((data: Article) => {
                        // Ordenar templates antes de setear el state
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
                        setLoading(false); // Activar animación después de setear el artículo
                        setTimeout(() => setIsVisible(true), 10);
                    })
                    .catch(() => setLoading(false));
            } else {
                setLoading(false);
            }
        }
    }, [isModalOpen]);

    const handleDownloadArticle = (_articleHtml: HTMLElement) => {
        window.print();
    };

    if (!isModalOpen) return null;

    if (!article) return null;

    return (
        <div
            className={`scrollbar-hide fixed inset-0 z-999 overflow-y-auto bg-black py-20 transition-opacity duration-300 print:h-auto print:min-h-screen print:py-0 ${
                isVisible ? 'opacity-100' : 'opacity-0'
            }`}
        >
            <div className="from-secondary via-primary fixed top-0 left-0 flex w-full justify-between bg-linear-to-b to-black px-6 py-3 print:hidden print:py-0">
                <Button
                    onClick={() => {
                        if (articleElement.current) {
                            handleDownloadArticle(articleElement.current);
                        }
                    }}
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
                        }, 300);
                    }}
                >
                    <X />
                    Cerrar
                </Button>
            </div>
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
                    {article.templates?.map(template => {
                        console.log(template.image_areas[0]);
                        if (
                            template.type === 'plantilla1' ||
                            template.type === 'plantilla2'
                        ) {
                            return (
                                <div key={template.id}>
                                    {plantilla(template)}
                                </div>
                            );
                        } else {
                            return (
                                <div key={template.id}>
                                    <p>
                                        Tipo de plantilla desconocido:{' '}
                                        {template.type}
                                    </p>
                                </div>
                            );
                        }
                    })}
                </section>
                <section className="flex flex-col gap-8 print:gap-4">
                    <h2 className="text-3xl font-bold print:text-[18pt]">
                        Bibliografía
                    </h2>
                    <ul className="w-full overflow-hidden text-sm print:text-[11pt]">
                        {/* {article.bibliografia} */}
                        {article.bibliografia
                            .split('\n')
                            .map((line, i, arr) => {
                                if (!line) return null;
                                const isLink = line.trim().startsWith('http');
                                return (
                                    <li key={i}>
                                        {isLink ? (
                                            <a
                                                href={line}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {line}
                                                {i < arr.length - 1 && <br />}
                                            </a>
                                        ) : (
                                            <p>
                                                {line}
                                                {i < arr.length - 1 && <br />}
                                            </p>
                                        )}
                                    </li>
                                );
                            })}
                    </ul>
                </section>
            </article>
        </div>
    );
}

function plantilla(plantilla: Template) {
    return (
        <>
            <section className="flex flex-col gap-8 print:gap-4">
                <div className="text-base print:text-[12pt]">
                    {/* {imageArea(plantilla.image_areas[0])} */}
                    {plantilla.image_areas[0] && (
                        <div className="float-left mr-4 mb-4 flex max-w-[60mm] flex-col">
                            <Image
                                src={`${API_CONFIG.baseUrl}${'/storage/'}${plantilla.image_areas[0].imagePath}`}
                                alt={plantilla.image_areas[0].imageFooter}
                                width={600}
                                height={847}
                                style={{
                                    aspectRatio: 210 / 297,
                                    objectFit: 'contain',
                                }}
                            />
                            <p className="text-center italic">
                                {plantilla.image_areas[0].imageFooter}
                            </p>
                        </div>
                    )}
                    <p className="m-0 text-sm">
                        {plantilla.text_areas[0].content
                            .split('\n')
                            .map((line, i, arr) => (
                                <span key={i}>
                                    {line}
                                    {i < arr.length - 1 && <br />}
                                </span>
                            ))}
                    </p>
                </div>
                <div className="w-full">
                    <h2 className="text-xl font-bold print:text-[13pt]">
                        Citas:
                    </h2>
                    <div className="text-sm print:text-[11pt]">
                        {plantilla.shortCitation}
                    </div>
                </div>
            </section>
        </>
    );
}
