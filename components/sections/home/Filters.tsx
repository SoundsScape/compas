import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { getTags } from '../../../lib/services/tagService';
import { Tag } from '../../../lib/interfaces/tag.interface';
import { getAllHistoricalPeriodNames } from '../../../lib/utils/historicalPeriods';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { formatYear } from '@/lib/utils/dateUtils';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

interface FiltersProps {
    filters: {
        search: string;
        yearRange: [number, number];
        categories: string[];
        eventTypes: string[];
        regions: string[];
    };
    setFilters: React.Dispatch<
        React.SetStateAction<{
            search: string;
            yearRange: [number, number];
            categories: string[];
            eventTypes: string[];
            regions: string[];
        }>
    >;
    setSelectedYearRange: (range: [number, number]) => void;
    minYear: number;
    maxYear: number;
}

const categories = getAllHistoricalPeriodNames();

const regions = [
    'Europa',
    'Asia',
    'América del Norte',
    'América del Sur',
    'África',
    'Oceanía',
    'Oriente Medio',
];

export default function Filters({
    filters,
    setFilters,
    setSelectedYearRange,
    minYear,
    maxYear,
}: FiltersProps) {
    const [startYear, setStartYear] = useState(filters.yearRange[0].toString());
    const [endYear, setEndYear] = useState(filters.yearRange[1].toString());
    const [tags, setTags] = useState<Tag[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sliderValue, setSliderValue] = useState<[number, number]>([0, 100]);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                setIsLoading(true);
                const fetchedTags = await getTags();
                setTags(fetchedTags);
                setIsLoading(false);
            } catch (err) {
                setError('Error al cargar los tags');
                setIsLoading(false);
                console.error(err);
            }
        };
        fetchTags();
    }, []);

    // Funciones logarítmicas (Sincronizadas con Timeline.tsx)
    const toLogarithmic = useCallback((year: number): number => {
        const sign = year >= 0 ? 1 : -1;
        const absYear = Math.abs(year);
        return (
            ((sign * Math.log(absYear + 1)) / Math.log(Math.abs(maxYear) + 1)) *
            Math.abs(maxYear)
        );
    }, [maxYear]);

    const fromLogarithmic = useCallback((logValue: number): number => {
        const calcLogMaxYear = toLogarithmic(maxYear);
        const calcLogMinYear = toLogarithmic(minYear);
        const tolerance = Math.abs(calcLogMaxYear - calcLogMinYear) * 0.01;

        if (Math.abs(logValue - calcLogMaxYear) <= tolerance) return maxYear;
        if (Math.abs(logValue - calcLogMinYear) <= tolerance) return minYear;

        const sign = logValue >= 0 ? 1 : -1;
        const absLogValue = Math.abs(logValue);

        const year = Math.round(
            Math.exp(
                (absLogValue * Math.log(Math.abs(maxYear) + 1)) /
                Math.abs(maxYear)
            ) - 1
        );

        return Math.max(minYear, Math.min(maxYear, sign * year));
    }, [maxYear, minYear, toLogarithmic]);

    // Calcular valores logarítmicos
    const logMinYear = toLogarithmic(minYear);
    const logMaxYear = toLogarithmic(maxYear);

    // Sincronizar slider y inputs cuando cambian los filtros
    useEffect(() => {
        const logStart = toLogarithmic(filters.yearRange[0]);
        const logEnd = toLogarithmic(filters.yearRange[1]);
        setSliderValue([logStart, logEnd]);
        setStartYear(filters.yearRange[0].toString());
        setEndYear(filters.yearRange[1].toString());
    }, [filters.yearRange, toLogarithmic]);

    // Manejo del Slider
    const handleSliderChange = (value: number[]) => {
        const [newLogStart, newLogEnd] = value;
        const newStart = fromLogarithmic(newLogStart);
        const newEnd = fromLogarithmic(newLogEnd);

        setSliderValue([newLogStart, newLogEnd]);
        setStartYear(newStart.toString());
        setEndYear(newEnd.toString());
    };

    const handleSliderCommit = (value: number[]) => {
        const [newLogStart, newLogEnd] = value;
        const newStart = fromLogarithmic(newLogStart);
        const newEnd = fromLogarithmic(newLogEnd);

        const newRange: [number, number] = [newStart, newEnd];
        setSelectedYearRange(newRange);
        setFilters(prev => ({ ...prev, yearRange: newRange }));
    };

    // Manejo de Inputs Manuales
    const handleYearInput = (value: string, isStart: boolean) => {
        if (isStart) setStartYear(value);
        else setEndYear(value);
    };

    const handleYearCommit = (isStart: boolean) => {
        let val = parseInt(isStart ? startYear : endYear);
        if (isNaN(val)) {
            // Revertir si no es número
            if (isStart) setStartYear(filters.yearRange[0].toString());
            else setEndYear(filters.yearRange[1].toString());
            return;
        }

        if (isStart) {
            val = Math.max(minYear, Math.min(val, filters.yearRange[1]));
            const newRange: [number, number] = [val, filters.yearRange[1]];
            setSelectedYearRange(newRange);
            setFilters(prev => ({ ...prev, yearRange: newRange }));
            setStartYear(val.toString());
        } else {
            val = Math.max(filters.yearRange[0], Math.min(val, maxYear));
            const newRange: [number, number] = [filters.yearRange[0], val];
            setSelectedYearRange(newRange);
            setFilters(prev => ({ ...prev, yearRange: newRange }));
            setEndYear(val.toString());
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, isStart: boolean) => {
        if (e.key === 'Enter') handleYearCommit(isStart);
    };

    // Alternar filtros
    const toggleFilter = (
        type: 'categories' | 'eventTypes' | 'regions',
        value: string
    ) => {
        setFilters(prev => ({
            ...prev,
            [type]: prev[type].includes(value)
                ? prev[type].filter(v => v !== value)
                : [...prev[type], value],
        }));
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            yearRange: [minYear, maxYear],
            categories: [],
            eventTypes: [],
            regions: [],
        });
        setSelectedYearRange([minYear, maxYear]);
    };

    return (
        <div className="overflow-y-auto bg-background/80 shadow-lg border border-border/50 backdrop-blur-md rounded-md 2xl:overflow-hidden h-[calc(100vh-120px)] w-[280px] lg:w-xs 2xl:w-sm flex flex-col pointer-events-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-primary/90 border-b border-border/10 shrink-0">
                <div className="flex items-center gap-2 text-primary-foreground">
                    <Filter className="h-4 w-4" />
                    <span className="text-lg font-semibold tracking-wider">Filtros</span>
                </div>
                <Button
                    variant="link"
                    size="sm"
                    onClick={clearFilters}
                    className="h-6 px-2 text-xs text-primary-foreground/90 hover:text-white hover:underline cursor-pointer"
                >
                    Limpiar filtros
                </Button>
            </div>

            {/* Main Content Area - Flex Column */}
            <div className="flex-1 flex flex-col min-h-0 p-4 gap-3 bg-primary/30">
                {/* Fixed Top Section: Search & Date Range */}
                <div className="space-y-4 shrink-0 border-b border-border/10">
                    {/* Buscador */}
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Buscar..."
                            value={filters.search}
                            onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                            className="pl-9 h-9 bg-background/50 border-input/50"
                        />
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    </div>

                    {/* Rango de Años */}
                    <div className="space-y-2">
                        <h3 className="text-xs font-semibold uppercase tracking-wider">Rango Temporal</h3>

                        <div className="flex gap-2">
                            <div className="flex-1 space-y-1">
                                <label className="text-xs text-muted-foreground">Desde</label>
                                <Input
                                    value={startYear}
                                    onChange={e => handleYearInput(e.target.value, true)}
                                    onBlur={() => handleYearCommit(true)}
                                    onKeyDown={e => handleKeyDown(e, true)}
                                    className="h-7 text-xs bg-background/50 mt-1"
                                />
                            </div>
                            <div className="flex-1 space-y-1">
                                <label className="text-xs text-muted-foreground">Hasta</label>
                                <Input
                                    value={endYear}
                                    onChange={e => handleYearInput(e.target.value, false)}
                                    onBlur={() => handleYearCommit(false)}
                                    onKeyDown={e => handleKeyDown(e, false)}
                                    className="h-7 text-xs bg-background/50 mt-1"
                                />
                            </div>
                        </div>

                        <div className="px-1 mt-4">
                            <Slider
                                defaultValue={[logMinYear, logMaxYear]}
                                value={sliderValue}
                                min={logMinYear}
                                max={logMaxYear}
                                step={1}
                                onValueChange={handleSliderChange}
                                onValueCommit={handleSliderCommit}
                                className="cursor-pointer"
                            />
                            <div className="flex justify-between mt-4">
                                <span className="text-xs text-muted-foreground">{formatYear(parseInt(startYear) || minYear)}</span>
                                <span className="text-xs text-muted-foreground">{formatYear(parseInt(endYear) || maxYear)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filtros Activos - Independent Scroll Area */}
                {(filters.categories.length > 0 || filters.eventTypes.length > 0 || filters.regions.length > 0) && (
                    <div className="relative shrink-0 max-h-[100px] lg:max-h-[140px] overflow-y-auto bg-background/50 rounded-sm custom-scrollbar">
                        <h3 className="sticky top-0 left-0 right-0 bg-primary px-3 py-2 text-xs font-semibold uppercase tracking-wider">Activos</h3>
                        <div className="flex flex-wrap gap-1.5 p-3">
                            {[...filters.categories, ...filters.eventTypes, ...filters.regions].map(filter => (
                                <span key={filter} className="inline-flex items-center gap-1.5 px-1.5 py-1 rounded-sm text-xs bg-secondary/70 text-primary-foreground border border-secondary">
                                    {filter}
                                    <button
                                        onClick={() => {
                                            setFilters(prev => ({
                                                ...prev,
                                                categories: prev.categories.filter(c => c !== filter),
                                                eventTypes: prev.eventTypes.filter(t => t !== filter),
                                                regions: prev.regions.filter(r => r !== filter),
                                            }));
                                        }}
                                        className="hover:text-destructive hover:bg-destructive/20 transition-colors cursor-pointer p-0.5 rounded-sm"
                                    >
                                        <X className="size-3.5" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                )}

                {/* Rest of Filters - Accordion */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <Accordion type="multiple" defaultValue={["etapas", "eventos", "regiones"]} className="space-y-3">
                        {/* Categorías (Etapas) */}
                        <AccordionItem value="etapas" className="bg-background/50 rounded-sm border-none">
                            <AccordionTrigger className="px-3 py-2 hover:no-underline bg-primary hover:bg-primary/60 rounded-sm">
                                <h3 className="text-xs font-semibold uppercase tracking-wider">Etapas Históricas</h3>
                            </AccordionTrigger>
                            <AccordionContent className="p-3">
                                <div className="flex flex-wrap gap-1.5">
                                    {categories.map(category => (
                                        <button
                                            key={category}
                                            onClick={() => toggleFilter('categories', category)}
                                            className={`px-2 py-1 rounded-sm text-xs transition-all hover:bg-primary/80 border cursor-pointer ${filters.categories.includes(category)
                                                ? 'bg-muted border-secondary/70 text-muted-foreground shadow-sm'
                                                : 'bg-secondary/70 border-secondary text-secondary-foreground hover:text-foreground'
                                                }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Tipos de Eventos */}
                        <AccordionItem value="eventos" className="bg-background/50 rounded-sm border-none">
                            <AccordionTrigger className="px-3 py-2 hover:no-underline bg-primary hover:bg-primary/60 rounded-sm">
                                <h3 className="text-xs font-semibold uppercase tracking-wider">Tipos de Eventos</h3>
                            </AccordionTrigger>
                            <AccordionContent className="p-3">
                                {isLoading ? (
                                    <p className="text-xs text-muted-foreground animate-pulse">Cargando...</p>
                                ) : error ? (
                                    <p className="text-xs text-destructive">{error}</p>
                                ) : (
                                    <div className="flex flex-wrap gap-1.5">
                                        {tags.map(tag => (
                                            <button
                                                key={tag.id}
                                                onClick={() => toggleFilter('eventTypes', tag.name)}
                                                className={`px-2 py-1 rounded-sm text-xs transition-all hover:bg-primary/80 border cursor-pointer ${filters.eventTypes.includes(tag.name)
                                                    ? 'bg-muted border-secondary/70 text-muted-foreground shadow-sm'
                                                    : 'bg-secondary/70 border-secondary text-secondary-foreground hover:text-foreground'
                                                    }`}
                                            >
                                                {tag.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </AccordionContent>
                        </AccordionItem>

                        {/* Regiones */}
                        <AccordionItem value="regiones" className="bg-background/50 rounded-sm border-none">
                            <AccordionTrigger className="px-3 py-2 hover:no-underline bg-primary hover:bg-primary/60 rounded-sm">
                                <h3 className="text-xs font-semibold uppercase tracking-wider">Regiones</h3>
                            </AccordionTrigger>
                            <AccordionContent className="p-3">
                                <div className="flex flex-wrap gap-1.5">
                                    {regions.map(region => (
                                        <button
                                            key={region}
                                            onClick={() => toggleFilter('regions', region)}
                                            className={`px-2 py-1 rounded-sm text-xs transition-all hover:bg-primary/80 border cursor-pointer ${filters.regions.includes(region)
                                                ? 'bg-muted border-secondary/70 text-muted-foreground shadow-sm'
                                                : 'bg-secondary/70 border-secondary text-secondary-foreground hover:text-foreground'
                                                }`}
                                        >
                                            {region}
                                        </button>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
        </div>
    );
}
