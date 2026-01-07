import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ActiveFiltersChipsProps } from '@/lib/interfaces/filters.interface';

export function ActiveFiltersChips({
    activeFilters,
    onRemove,
}: ActiveFiltersChipsProps) {
    if (activeFilters.length === 0) return null;

    return (
        <div className="custom-scrollbar bg-background/50 relative max-h-[100px] shrink-0 overflow-y-auto rounded-sm lg:max-h-[140px]">
            <h3 className="bg-primary sticky top-0 right-0 left-0 px-3 py-2 text-xs font-semibold tracking-wider uppercase">
                Activos
            </h3>
            <div className="flex flex-wrap gap-1.5 p-3">
                {activeFilters.map(filter => (
                    <Button
                        key={filter}
                        variant="filterInactive"
                        size="sm"
                        className="hover:[&_svg]:text-destructive h-auto cursor-pointer gap-1.5 rounded-sm px-1.5 py-1 text-xs transition-colors"
                        onClick={() => onRemove(filter)}
                    >
                        {filter}
                        <X className="size-3.5" />
                    </Button>
                ))}
            </div>
        </div>
    );
}
