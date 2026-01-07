import { formatYear } from '@/lib/utils/dateUtils';
import { Slider } from '@/components/ui/slider';
import { useEffect, useState, useCallback } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TimelineProps } from '@/lib/interfaces/timelite.interface';

export default function Timeline({
    selectedYearRange,
    setSelectedYearRange,
    minYear,
    maxYear,
}: TimelineProps) {
    const [sliderValue, setSliderValue] = useState<[number, number]>([0, 100]);
    const [_inputValue, setInputValue] = useState<{
        start: string;
        end: string;
    }>({
        start: '',
        end: '',
    });
    const [isMinimized, setIsMinimized] = useState(false);

    // Funciones para transformación logarítmica (mantenemos la lógica existente)
    const toLogarithmic = useCallback(
        (year: number): number => {
            const sign = year >= 0 ? 1 : -1;
            const absYear = Math.abs(year);
            // Usamos logaritmo para comprimir los años antiguos y expandir los recientes
            // Añadimos 1 para evitar log(0)
            return (
                ((sign * Math.log(absYear + 1)) /
                    Math.log(Math.abs(maxYear) + 1)) *
                Math.abs(maxYear)
            );
        },
        [maxYear]
    );

    const fromLogarithmic = useCallback(
        (logValue: number): number => {
            const calcLogMaxYear = toLogarithmic(maxYear);
            const calcLogMinYear = toLogarithmic(minYear);
            const tolerance = Math.abs(calcLogMaxYear - calcLogMinYear) * 0.01;

            if (Math.abs(logValue - calcLogMaxYear) <= tolerance) {
                return maxYear;
            }
            if (Math.abs(logValue - calcLogMinYear) <= tolerance) {
                return minYear;
            }

            const sign = logValue >= 0 ? 1 : -1;
            const absLogValue = Math.abs(logValue);

            const year = Math.round(
                Math.exp(
                    (absLogValue * Math.log(Math.abs(maxYear) + 1)) /
                        Math.abs(maxYear)
                ) - 1
            );

            return Math.max(minYear, Math.min(maxYear, sign * year));
        },
        [maxYear, minYear, toLogarithmic]
    );

    // Initial load
    useEffect(() => {
        const logStart = toLogarithmic(selectedYearRange[0]);
        const logEnd = toLogarithmic(selectedYearRange[1]);
        setSliderValue([logStart, logEnd]);
        setInputValue({
            start: selectedYearRange[0].toString(),
            end: selectedYearRange[1].toString(),
        });
    }, [selectedYearRange, toLogarithmic]);

    // Handle Slider Change
    const handleSliderChange = (value: number[]) => {
        const [newLogStart, newLogEnd] = value;
        const newStart = fromLogarithmic(newLogStart);
        const newEnd = fromLogarithmic(newLogEnd);

        // Update local state smoothly
        setSliderValue([newLogStart, newLogEnd]);
        setInputValue({
            start: newStart.toString(),
            end: newEnd.toString(),
        });
    };

    // Handle Slider Commit (when user releases handle)
    const handleSliderCommit = (value: number[]) => {
        const [newLogStart, newLogEnd] = value;
        const newStart = fromLogarithmic(newLogStart);
        const newEnd = fromLogarithmic(newLogEnd);
        setSelectedYearRange([newStart, newEnd]);
    };

    const logMinYear = toLogarithmic(minYear);
    const logMaxYear = toLogarithmic(maxYear);

    return (
        <div className="pointer-events-auto absolute bottom-6 left-1/2 z-20 hidden w-[45%] max-w-3xl -translate-x-1/2 transform transition-all duration-300 xl:block">
            <div className="bg-background/80 border-border/50 overflow-hidden rounded-md border shadow-lg backdrop-blur-md">
                <div className="bg-primary/90 border-border/10 flex items-center justify-between border-b px-4 py-2">
                    <span className="text-lg font-semibold tracking-wide">
                        Linea de Tiempo
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-muted/60 hover:text-accent h-6 w-6 p-0"
                        onClick={() => setIsMinimized(!isMinimized)}
                    >
                        {isMinimized ? (
                            <ChevronUp className="size-6" />
                        ) : (
                            <ChevronDown className="size-6" />
                        )}
                    </Button>
                </div>

                {!isMinimized && (
                    <div className="w-full flex-1 p-3 px-6">
                        <div className="flex items-baseline justify-between px-1">
                            <span className="text-md text-muted-foreground">
                                {formatYear(minYear)}
                            </span>
                            <span className="text-lg tracking-wider">
                                Rango: {formatYear(selectedYearRange[0])} -{' '}
                                {formatYear(selectedYearRange[1])}
                            </span>
                            <span className="text-md text-muted-foreground">
                                {formatYear(maxYear)}
                            </span>
                        </div>
                        <Slider
                            defaultValue={[logMinYear, logMaxYear]}
                            value={sliderValue}
                            min={logMinYear}
                            max={logMaxYear}
                            step={1}
                            onValueChange={handleSliderChange}
                            onValueCommit={handleSliderCommit}
                            className="cursor-pointer py-4"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
