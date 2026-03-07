import { API_CONFIG } from '@/lib/config/api.config';
import { Template } from '@/lib/interfaces/article.interface';
import Image from 'next/image';

export function ArticleTemplate(template: Template) {

    if (
        template.type !== 'plantilla1' &&
        template.type !== 'plantilla2'
    ) {
        return (
            <div key={template.id}>
                <p>
                    Tipo de plantilla desconocido:{' '}
                    {template.type}
                </p>
            </div>
        );
    }

    return (
        <>
            <section className="flex flex-col gap-8 print:gap-4">
                <div className="text-base print:text-[12pt]">
                    {template.image_areas[0] && (
                        <div className="float-left mr-4 mb-4 flex max-w-[60mm] flex-col">
                            <Image
                                src={template.image_areas[0].imagePath.startsWith('http')
                                    ? template.image_areas[0].imagePath
                                    : `${API_CONFIG.baseUrl}/storage/${template.image_areas[0].imagePath.replace(/^\/?(storage\/)?/, '').replace(/^images\//, 'articles/')}`
                                }
                                alt={template.image_areas[0].imageFooter}
                                width={600}
                                height={847}
                                style={{
                                    aspectRatio: 210 / 297,
                                    objectFit: 'contain',
                                }}
                            />
                            <p className="text-center italic">
                                {template.image_areas[0].imageFooter}
                            </p>
                        </div>
                    )}
                    <p className="m-0 text-sm">
                        {template.text_areas[0].content
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
                        {template.shortCitation}
                    </div>
                </div>
            </section>
        </>
    );
}
