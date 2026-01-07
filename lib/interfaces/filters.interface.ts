export interface Tag {
    id: number;
    name: string;
    created_at: Date;
    updated_at: Date;
}

export interface ActiveFiltersChipsProps {
    activeFilters: string[];
    onRemove: (filter: string) => void;
}

export interface FiltersSectionProps {
    filters: {
        categories: string[];
        eventTypes: string[];
        regions: string[];
    };
    categories: string[];
    tags: Tag[];
    regions: string[];
    isLoading: boolean;
    error: string | null;
    toggleFilter: (
        type: 'categories' | 'eventTypes' | 'regions',
        value: string
    ) => void;
}

export interface YearRangeSelectorProps {
    minYear: number;
    maxYear: number;
    value: [number, number];
    onChange: (range: [number, number]) => void;
}

export interface FiltersProps {
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

export interface FiltersPanelProps {
    showFilters: boolean;
    setShowFilters: (val: boolean) => void;
    filters: any;
    setFilters: (filters: any) => void;
    setSelectedYearRange: (range: [number, number]) => void;
    minYear: number;
    maxYear: number;
}
