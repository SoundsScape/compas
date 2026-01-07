import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { getTags } from '@/lib/services/tagService';
import { Tag } from '@/lib/interfaces/filters.interface';
import { getAllHistoricalPeriodNames } from '@/lib/utils/historicalPeriods';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { YearRangeSelector } from './filters/YearRangeSelector';
import { ActiveFiltersChips } from './filters/ActiveFiltersChips';
import { FiltersSection } from './filters/FiltersSection';
import { FiltersProps } from '@/lib/interfaces/filters.interface';

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
    const [tags, setTags] = useState<Tag[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    const handleYearRangeChange = (range: [number, number]) => {
        setSelectedYearRange(range);
        setFilters(prev => ({ ...prev, yearRange: range }));
    };

    const handleRemoveActiveFilter = (filter: string) => {
        setFilters(prev => ({
            ...prev,
            categories: prev.categories.filter(c => c !== filter),
            eventTypes: prev.eventTypes.filter(t => t !== filter),
            regions: prev.regions.filter(r => r !== filter),
        }));
    };

    const activeFilters = [
        ...filters.categories,
        ...filters.eventTypes,
        ...filters.regions,
    ];

    return (
        <div className="bg-background/80 border-border/50 pointer-events-auto flex h-[calc(100vh-120px)] w-[280px] flex-col overflow-y-auto rounded-md border shadow-lg backdrop-blur-md lg:w-xs 2xl:w-sm 2xl:overflow-hidden">
            {/* Header */}
            <div className="bg-primary/90 border-border/10 flex shrink-0 items-center justify-between border-b px-4 py-2">
                <div className="text-primary-foreground flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span className="text-lg font-semibold tracking-wider">
                        Filtros
                    </span>
                </div>
                <Button
                    variant="link"
                    size="sm"
                    onClick={clearFilters}
                    className="text-primary-foreground/90 h-6 cursor-pointer px-2 text-xs hover:text-white hover:underline"
                >
                    Limpiar filtros
                </Button>
            </div>

            {/* Main Content Area */}
            <div className="bg-primary/30 flex min-h-0 flex-1 flex-col gap-3 p-4">
                {/* Search & Year Range */}
                <div className="border-border/10 shrink-0 space-y-4 border-b">
                    {/* Search */}
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Buscar..."
                            value={filters.search}
                            onChange={e =>
                                setFilters(prev => ({
                                    ...prev,
                                    search: e.target.value,
                                }))
                            }
                            className="bg-background/50 border-input/50 h-9 pl-9"
                        />
                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    </div>

                    {/* Year Range */}
                    <YearRangeSelector
                        minYear={minYear}
                        maxYear={maxYear}
                        value={filters.yearRange}
                        onChange={handleYearRangeChange}
                    />
                </div>

                {/* Active Filters */}
                <ActiveFiltersChips
                    activeFilters={activeFilters}
                    onRemove={handleRemoveActiveFilter}
                />

                {/* Filter Sections */}
                <FiltersSection
                    filters={{
                        categories: filters.categories,
                        eventTypes: filters.eventTypes,
                        regions: filters.regions,
                    }}
                    categories={categories}
                    tags={tags}
                    regions={regions}
                    isLoading={isLoading}
                    error={error}
                    toggleFilter={toggleFilter}
                />
            </div>
        </div>
    );
}
