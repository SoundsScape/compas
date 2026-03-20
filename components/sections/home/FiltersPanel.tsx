import { ChevronLeft, ChevronRight } from 'lucide-react';
import Filters from './Filters';
import { Button } from '@/components/ui/button';
import { FiltersPanelProps } from '@/lib/interfaces/filters.interface';

export function FiltersPanel({
    showFilters,
    setShowFilters,
    filters,
    setFilters,
    setSelectedYearRange,
    dateFormat,
}: FiltersPanelProps) {
    return (
        <div
            className={`pointer-events-auto fixed top-20 left-4 z-10 flex items-start gap-1 transition-all duration-300 print:hidden ${showFilters ? '-translate-x-[290px] lg:-translate-x-[370px] 2xl:-translate-x-[440px]' : 'translate-x-0'}`}
        >
            <div
                className={`transition-all duration-400 ${showFilters ? 'opacity-0' : 'opacity-100'}`}
            >
                <Filters
                    filters={filters}
                    setFilters={setFilters}
                    setSelectedYearRange={setSelectedYearRange}
                    dateFormat={dateFormat}
                />
            </div>
            <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="control"
                size="icon-lg"
                className='bg-linear-to-bl'
            >
                {showFilters ? (
                    <ChevronRight className="size-5.5" />
                ) : (
                    <ChevronLeft className="size-5.5" />
                )}
            </Button>
        </div>
    );
}
