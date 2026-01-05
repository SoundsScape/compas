import { useState, useEffect } from 'react';

export interface FilterState {
    search: string;
    yearRange: [number, number];
    categories: string[];
    eventTypes: string[];
    regions: string[];
}

export function useFilters(minYear: number, maxYear: number) {
    const [selectedYearRange, setSelectedYearRange] = useState<
        [number, number]
    >([minYear, maxYear]);
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        yearRange: [minYear, maxYear],
        categories: [],
        eventTypes: [],
        regions: [],
    });

    useEffect(() => {
        if (
            filters.yearRange[0] !== selectedYearRange[0] ||
            filters.yearRange[1] !== selectedYearRange[1]
        ) {
            setFilters(prev => ({
                ...prev,
                yearRange: selectedYearRange,
            }));
        }
    }, [selectedYearRange]);

    return {
        filters,
        setFilters,
        selectedYearRange,
        setSelectedYearRange,
    };
}
