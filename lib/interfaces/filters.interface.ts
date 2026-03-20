export interface Tag {
    id: number;
    name: string;
    created_at?: string | Date;
    updated_at?: string | Date;
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
    value: [number, number];
    onChange: (range: [number, number]) => void;
    dateFormat?: 'AC/DC' | 'BCE/CE';
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
    dateFormat?: 'AC/DC' | 'BCE/CE';
}

export interface FiltersPanelProps {
    showFilters: boolean;
    setShowFilters: (val: boolean) => void;
    filters: any;
    setFilters: (filters: any) => void;
    setSelectedYearRange: (range: [number, number]) => void;
    dateFormat?: 'AC/DC' | 'BCE/CE';
}
