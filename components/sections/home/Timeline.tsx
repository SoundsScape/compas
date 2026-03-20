import { formatYear } from '@/lib/utils/dateUtils';
import { Slider } from '@/components/ui/slider';
import { useEffect, useState, useCallback } from 'react';
import { TimelineProps } from '@/lib/interfaces/timelite.interface';
import { MAX_YEAR, MIN_YEAR } from '@/lib/constants/yearsRange';

export default function Timeline({
    selectedYearRange,
    setSelectedYearRange,
    dateFormat,
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
                    Math.log(Math.abs(MAX_YEAR) + 1)) *
                Math.abs(MAX_YEAR)
            );
        },
        []
    );

    const fromLogarithmic = useCallback(
        (logValue: number): number => {
            const calcLogMaxYear = toLogarithmic(MAX_YEAR);
            const calcLogMinYear = toLogarithmic(MIN_YEAR);
            const tolerance = Math.abs(calcLogMaxYear - calcLogMinYear) * 0.01;

            if (Math.abs(logValue - calcLogMaxYear) <= tolerance) {
                return MAX_YEAR;
            }
            if (Math.abs(logValue - calcLogMinYear) <= tolerance) {
                return MIN_YEAR;
            }

            const sign = logValue >= 0 ? 1 : -1;
            const absLogValue = Math.abs(logValue);

            const year = Math.round(
                Math.exp(
                    (absLogValue * Math.log(Math.abs(MAX_YEAR) + 1)) /
                    Math.abs(MAX_YEAR)
                ) - 1
            );

            return Math.max(MIN_YEAR, Math.min(MAX_YEAR, sign * year));
        },
        [toLogarithmic]
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

    const logMinYear = toLogarithmic(MIN_YEAR);
    const logMaxYear = toLogarithmic(MAX_YEAR);

    return (
        <div className="flex-1">
            <div className="bg-background/80 border-border/50 overflow-hidden rounded-md border shadow-lg backdrop-blur-xl">
                <div className="bg-linear-to-br from-primary to-secondary flex items-center justify-between border-b px-4 py-2">
                    <span className="text-md font-semibold tracking-wide">
                        Linea de Tiempo
                    </span>
                </div>

                {!isMinimized && (
                    <div className="w-full flex-1 py-4 px-6">
                        <div className="flex items-baseline justify-between px-1">
                            <span className="text-sm font-mono text-muted-foreground">
                                {formatYear(MIN_YEAR, dateFormat)}
                            </span>
                            <span className="text-sm tracking-wider">
                                Rango: {formatYear(selectedYearRange[0], dateFormat)} -{' '}
                                {formatYear(selectedYearRange[1], dateFormat)}
                            </span>
                            <span className="text-sm font-mono text-muted-foreground">
                                {formatYear(MAX_YEAR, dateFormat)}
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
                            className="cursor-pointer pt-4"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
