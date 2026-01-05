import { ChevronLeft, ChevronRight } from 'lucide-react';
import Filters from './Filters';

interface FiltersPanelProps {
    showFilters: boolean;
    setShowFilters: (val: boolean) => void;
    filters: any;
    setFilters: (filters: any) => void;
    setSelectedYearRange: (range: [number, number]) => void;
    minYear: number;
    maxYear: number;
}

export function FiltersPanel({
    showFilters,
    setShowFilters,
    filters,
    setFilters,
    setSelectedYearRange,
    minYear,
    maxYear,
}: FiltersPanelProps) {
    return (
        <div
            className={`pointer-events-auto fixed top-20 left-4 z-10 flex items-start gap-1 transition-all duration-300 ${showFilters ? '-translate-x-[280px]' : 'translate-x-0'}`}
        >
            <Filters
                filters={filters}
                setFilters={setFilters}
                setSelectedYearRange={setSelectedYearRange}
                minYear={minYear}
                maxYear={maxYear}
            />
            <button
                onClick={() => setShowFilters(!showFilters)}
                className={`bg-primary hover:text-accent z-20 rounded-md p-2 text-white backdrop-blur-md`}
            >
                {showFilters ? <ChevronRight /> : <ChevronLeft />}
            </button>
        </div>
    );
}
