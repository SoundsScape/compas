import { ChevronLeft, ChevronRight } from 'lucide-react';
import Filters from './Filters';
import { Button } from '@/components/ui/button';

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
            className={`pointer-events-auto fixed top-20 left-4 z-10 flex items-start gap-1 transition-all duration-300 ${showFilters ? '-translate-x-[290px] lg:-translate-x-[370px] 2xl:-translate-x-[440px]' : 'translate-x-0'}`}
        >
            <div className={` transition-all duration-400 ${showFilters ? 'opacity-0' : 'opacity-100'}`}>
            <Filters
                filters={filters}
                setFilters={setFilters}
                setSelectedYearRange={setSelectedYearRange}
                minYear={minYear}
                maxYear={maxYear}
            /></div>
            <Button
                onClick={() => setShowFilters(!showFilters)}
                className={`hover:text-accent z-20 size-11`}
            >
                {showFilters ? <ChevronRight  className="size-5.5" /> : <ChevronLeft className="size-5.5" />}
            </Button>
        </div>
    );
}
