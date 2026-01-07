import { useCallback, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { formatYear } from '@/lib/utils/dateUtils';
import { YearRangeSelectorProps } from '@/lib/interfaces/filters.interface';

export function YearRangeSelector({
    minYear,
    maxYear,
    value,
    onChange,
}: YearRangeSelectorProps) {
    const [startYear, setStartYear] = useState(value[0].toString());
    const [endYear, setEndYear] = useState(value[1].toString());
    const [sliderValue, setSliderValue] = useState<[number, number]>([0, 100]);

    // Funciones logarítmicas (Sincronizadas con Timeline.tsx)
    const toLogarithmic = useCallback(
        (year: number): number => {
            const sign = year >= 0 ? 1 : -1;
            const absYear = Math.abs(year);
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

            if (Math.abs(logValue - calcLogMaxYear) <= tolerance)
                return maxYear;
            if (Math.abs(logValue - calcLogMinYear) <= tolerance)
                return minYear;

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

    const logMinYear = toLogarithmic(minYear);
    const logMaxYear = toLogarithmic(maxYear);

    // Sincronizar slider y inputs cuando cambian los valores
    useEffect(() => {
        const logStart = toLogarithmic(value[0]);
        const logEnd = toLogarithmic(value[1]);
        setSliderValue([logStart, logEnd]);
        setStartYear(value[0].toString());
        setEndYear(value[1].toString());
    }, [value, toLogarithmic]);

    const handleSliderChange = (newValue: number[]) => {
        const [newLogStart, newLogEnd] = newValue;
        const newStart = fromLogarithmic(newLogStart);
        const newEnd = fromLogarithmic(newLogEnd);

        setSliderValue([newLogStart, newLogEnd]);
        setStartYear(newStart.toString());
        setEndYear(newEnd.toString());
    };

    const handleSliderCommit = (newValue: number[]) => {
        const [newLogStart, newLogEnd] = newValue;
        const newStart = fromLogarithmic(newLogStart);
        const newEnd = fromLogarithmic(newLogEnd);
        onChange([newStart, newEnd]);
    };

    const handleYearInput = (inputValue: string, isStart: boolean) => {
        if (isStart) setStartYear(inputValue);
        else setEndYear(inputValue);
    };

    const handleYearCommit = (isStart: boolean) => {
        let val = parseInt(isStart ? startYear : endYear);
        if (isNaN(val)) {
            if (isStart) setStartYear(value[0].toString());
            else setEndYear(value[1].toString());
            return;
        }

        if (isStart) {
            val = Math.max(minYear, Math.min(val, value[1]));
            setStartYear(val.toString());
            onChange([val, value[1]]);
        } else {
            val = Math.max(value[0], Math.min(val, maxYear));
            setEndYear(val.toString());
            onChange([value[0], val]);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, isStart: boolean) => {
        if (e.key === 'Enter') handleYearCommit(isStart);
    };

    return (
        <div className="space-y-2">
            <h3 className="text-xs font-semibold tracking-wider uppercase">
                Rango Temporal
            </h3>

            <div className="flex gap-2">
                <div className="flex-1 space-y-1">
                    <label className="text-muted-foreground text-xs">
                        Desde
                    </label>
                    <Input
                        value={startYear}
                        onChange={e => handleYearInput(e.target.value, true)}
                        onBlur={() => handleYearCommit(true)}
                        onKeyDown={e => handleKeyDown(e, true)}
                        className="bg-background/50 mt-1 h-7 text-xs"
                    />
                </div>
                <div className="flex-1 space-y-1">
                    <label className="text-muted-foreground text-xs">
                        Hasta
                    </label>
                    <Input
                        value={endYear}
                        onChange={e => handleYearInput(e.target.value, false)}
                        onBlur={() => handleYearCommit(false)}
                        onKeyDown={e => handleKeyDown(e, false)}
                        className="bg-background/50 mt-1 h-7 text-xs"
                    />
                </div>
            </div>

            <div className="mt-4 px-1">
                <Slider
                    defaultValue={[logMinYear, logMaxYear]}
                    value={sliderValue}
                    min={logMinYear}
                    max={logMaxYear}
                    step={1}
                    onValueChange={handleSliderChange}
                    onValueCommit={handleSliderCommit}
                    className="cursor-pointer"
                />
                <div className="mt-4 flex justify-between">
                    <span className="text-muted-foreground text-xs">
                        {formatYear(parseInt(startYear) || minYear)}
                    </span>
                    <span className="text-muted-foreground text-xs">
                        {formatYear(parseInt(endYear) || maxYear)}
                    </span>
                </div>
            </div>
        </div>
    );
}
