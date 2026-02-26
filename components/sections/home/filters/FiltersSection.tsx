import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { FiltersSectionProps } from '@/lib/interfaces/filters.interface';

export function FiltersSection({
    filters,
    categories,
    tags,
    regions,
    isLoading,
    error,
    toggleFilter,
}: FiltersSectionProps) {
    return (
        <div className="custom-scrollbar flex-1 overflow-y-auto">
            <Accordion
                type="multiple"
                defaultValue={['etapas', 'eventos', 'regiones']}
                className="space-y-3"
            >
                {/* Etapas Históricas */}
                <AccordionItem value="etapas">
                    <AccordionTrigger>Etapas Históricas</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-wrap gap-1.5">
                            {categories.map(category => (
                                <Button
                                    onClick={() =>
                                        toggleFilter('categories', category)
                                    }
                                    key={category}
                                    variant={
                                        filters.categories.includes(category)
                                            ? 'filterActive'
                                            : 'filterInactive'
                                    }
                                    size="filter"
                                >
                                    {category}
                                </Button>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Tipos de Eventos */}
                <AccordionItem value="eventos">
                    <AccordionTrigger>Tipos de Eventos</AccordionTrigger>
                    <AccordionContent>
                        {isLoading ? (
                            <p className="text-muted-foreground animate-pulse text-xs">
                                Cargando...
                            </p>
                        ) : error ? (
                            <p className="text-destructive text-xs">{error}</p>
                        ) : (
                            <div className="flex flex-wrap gap-1.5">
                                {Array.isArray(tags) && tags.map(tag => (
                                    <Button
                                        key={tag.id}
                                        variant={
                                            filters.eventTypes.includes(
                                                tag.name
                                            )
                                                ? 'filterActive'
                                                : 'filterInactive'
                                        }
                                        size="filter"
                                        onClick={() =>
                                            toggleFilter('eventTypes', tag.name)
                                        }
                                    >
                                        {tag.name}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </AccordionContent>
                </AccordionItem>

                {/* Regiones */}
                <AccordionItem value="regiones">
                    <AccordionTrigger>Regiones</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-wrap gap-1.5">
                            {regions.map(region => (
                                <Button
                                    key={region}
                                    variant={
                                        filters.regions.includes(region)
                                            ? 'filterActive'
                                            : 'filterInactive'
                                    }
                                    size="filter"
                                    onClick={() =>
                                        toggleFilter('regions', region)
                                    }
                                >
                                    {region}
                                </Button>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
