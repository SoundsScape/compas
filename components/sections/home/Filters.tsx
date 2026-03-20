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
import { MAX_YEAR, MIN_YEAR } from '@/lib/constants/yearsRange';

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
    dateFormat,
}: FiltersProps) {
    const [tags, setTags] = useState<Tag[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                setIsLoading(true);
                const response = await getTags();
                setTags(Array.isArray(response) ? response : (response as any).data || []);
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
            yearRange: [MIN_YEAR, MAX_YEAR],
            categories: [],
            eventTypes: [],
            regions: [],
        });
        setSelectedYearRange([MIN_YEAR, MAX_YEAR]);
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
        <div className="bg-background/80 pointer-events-auto flex h-[calc(100vh-120px)] w-[280px] flex-col overflow-y-auto rounded-md border shadow-lg backdrop-blur-xl lg:w-xs 2xl:w-sm 2xl:overflow-hidden">
            {/* Header */}
            <div className="bg-linear-to-br from-primary to-secondary flex shrink-0 items-center justify-between border-b px-4 py-2">
                <div className="text-primary-foreground flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span className="text-md font-semibold tracking-wider">
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
            <div className="bg-primary/10 flex min-h-0 flex-1 flex-col gap-3 p-4 pr-2">
                {/* Search & Year Range */}
                <div className="shrink-0 space-y-4 pr-2">
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
                            className="bg-background h-9 pl-9 "
                        />
                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    </div>

                    {/* Year Range */}
                    <YearRangeSelector
                        value={filters.yearRange}
                        onChange={handleYearRangeChange}
                        dateFormat={dateFormat}
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
