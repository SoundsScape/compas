import { formatYear } from '../../../lib/utils/dateUtils';

interface TimelineProps {
    selectedYearRange: [number, number];
    setSelectedYearRange: (range: [number, number]) => void;
    minYear: number;
    maxYear: number;
    dateFormat: 'AC/DC' | 'BCE/CE';
}

// parseSafeDate y formatYear ahora se importan desde utils/dateUtils

export default function Timeline({
    selectedYearRange,
    setSelectedYearRange,
    minYear,
    maxYear,
    dateFormat,
}: TimelineProps) {
    // Usa formatYear de utils/dateUtils para formatear años y fechas
    // Ejemplo de uso: formatYear(year, dateFormat)

    // Funciones para transformación logarítmica
    const toLogarithmic = (year: number): number => {
        // Ajustamos para manejar años negativos y positivos
        const sign = year >= 0 ? 1 : -1;
        const absYear = Math.abs(year);

        // Usamos logaritmo para comprimir los años antiguos y expandir los recientes
        // Añadimos 1 para evitar log(0)
        return (
            ((sign * Math.log(absYear + 1)) / Math.log(Math.abs(maxYear) + 1)) *
            Math.abs(maxYear)
        );
    };

    const fromLogarithmic = (logValue: number): number => {
        // Calcular los límites logarítmicos
        const calcLogMaxYear = toLogarithmic(maxYear);
        const calcLogMinYear = toLogarithmic(minYear);

        // Si estamos en los extremos con tolerancia, devolver exactamente el min o max
        const tolerance = Math.abs(calcLogMaxYear - calcLogMinYear) * 0.01; // 1% del rango

        if (Math.abs(logValue - calcLogMaxYear) <= tolerance) {
            return maxYear;
        }
        if (Math.abs(logValue - calcLogMinYear) <= tolerance) {
            return minYear;
        }

        // Convertimos de valor logarítmico a año real
        const sign = logValue >= 0 ? 1 : -1;
        const absLogValue = Math.abs(logValue);

        // Transformación inversa
        const year = Math.round(
            Math.exp(
                (absLogValue * Math.log(Math.abs(maxYear) + 1)) /
                    Math.abs(maxYear)
            ) - 1
        );

        // Asegurar que no excede los límites
        const clampedYear = Math.max(minYear, Math.min(maxYear, sign * year));
        return clampedYear;
    };

    // Convertimos los valores del rango a escala logarítmica para visualización
    const logMinYear = toLogarithmic(minYear);
    const logMaxYear = toLogarithmic(maxYear);
    const logSelectedStart = toLogarithmic(selectedYearRange[0]);
    const logSelectedEnd = toLogarithmic(selectedYearRange[1]);

    const handleRangeChange = (logValue: number, isStart: boolean) => {
        // Calcular los límites con el mismo método que en fromLogarithmic
        const calcLogMaxYear = toLogarithmic(maxYear);
        const calcLogMinYear = toLogarithmic(minYear);
        const tolerance = Math.abs(calcLogMaxYear - calcLogMinYear) * 0.02; // 2% del rango para el slider

        let realYear: number;

        // Detectar si estamos muy cerca de los extremos
        if (Math.abs(logValue - calcLogMaxYear) <= tolerance) {
            realYear = maxYear;
        } else if (Math.abs(logValue - calcLogMinYear) <= tolerance) {
            realYear = minYear;
        } else {
            // Convertimos el valor logarítmico de vuelta a año real
            realYear = fromLogarithmic(logValue);
        }

        if (isStart) {
            if (realYear <= selectedYearRange[1]) {
                setSelectedYearRange([realYear, selectedYearRange[1]]);
            }
        } else {
            if (realYear >= selectedYearRange[0]) {
                setSelectedYearRange([selectedYearRange[0], realYear]);
            }
        }
    };

    return (
        <div className="pointer-events-auto absolute bottom-8 left-1/2 z-20 w-3/4 max-w-3xl -translate-x-1/2 transform rounded-lg backdrop-blur-md">
            <div className="bg-primary/90 flex flex-col gap-4 rounded-lg p-6 text-white backdrop-blur-sm dark:bg-black">
                <div className="flex items-center justify-between">
                    <span className="text-sm">
                        {formatYear(minYear, dateFormat)}
                    </span>
                    <span className="text-lg font-bold">
                        Rango: {formatYear(selectedYearRange[0], dateFormat)} -{' '}
                        {formatYear(selectedYearRange[1], dateFormat)}
                    </span>
                    <span className="text-sm">
                        {formatYear(maxYear, dateFormat)}
                    </span>
                </div>
                <div className="flex gap-4">
                    <div className="relative w-full">
                        <div
                            className="absolute top-1 h-2 -translate-y-1/2 rounded-lg bg-white/30"
                            style={{
                                left: `${((logSelectedStart - logMinYear) / (logMaxYear - logMinYear)) * 100}%`,
                                right: `${100 - ((logSelectedEnd - logMinYear) / (logMaxYear - logMinYear)) * 100}%`,
                            }}
                        />
                        <input
                            type="range"
                            min={logMinYear}
                            max={logMaxYear}
                            value={logSelectedStart}
                            onChange={e =>
                                handleRangeChange(Number(e.target.value), true)
                            }
                            className="absolute h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/5 focus:ring-2 focus:ring-white/20 focus:outline-none [&::-moz-range-thumb]:relative [&::-moz-range-thumb]:z-10 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-black/90 [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:hover:bg-black/70 [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black/90 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:hover:bg-black/70 dark:[&::-webkit-slider-thumb]:bg-white/90"
                            step="1"
                        />
                    </div>
                    <div className="relative w-full">
                        <div
                            className="absolute top-1 h-2 -translate-y-1/2 rounded-lg bg-white/30"
                            style={{
                                left: `${((logSelectedStart - logMinYear) / (logMaxYear - logMinYear)) * 100}%`,
                                right: `${100 - ((logSelectedEnd - logMinYear) / (logMaxYear - logMinYear)) * 100}%`,
                            }}
                        />
                        <input
                            type="range"
                            min={logMinYear}
                            max={logMaxYear}
                            value={logSelectedEnd}
                            onChange={e =>
                                handleRangeChange(Number(e.target.value), false)
                            }
                            className="absolute h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/5 focus:ring-2 focus:ring-white/20 focus:outline-none [&::-moz-range-thumb]:relative [&::-moz-range-thumb]:z-10 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-black/90 [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:hover:bg-black/70 [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black/90 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:hover:bg-black/70 dark:[&::-webkit-slider-thumb]:bg-white/90"
                            step="1"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
