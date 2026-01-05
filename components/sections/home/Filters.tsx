// Importaciones de React y useState
import React, { useState, useEffect } from 'react';
// Importaciones de iconos
import { Search, Filter, X } from 'lucide-react';
// Importación del servicio de tags y la interfaz
import { getTags } from '../../../lib/services/tagService';
import { Tag } from '../../../lib/interfaces/tag.interface';
// Importar períodos históricos
import { getAllHistoricalPeriodNames } from '../../../lib/utils/historicalPeriods';

interface FiltersProps {
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
    minYear: number;
    maxYear: number;
}

// Etapas históricas obtenidas de historicalPeriods.tsx
const categories = getAllHistoricalPeriodNames();

// Regiones geográficas
const regions = [
    'Europa',
    'Asia',
    'América del Norte',
    'América del Sur',
    'África',
    'Oceanía',
    'Oriente Medio',
];

export default function Filters({
    filters,
    setFilters,
    setSelectedYearRange,
    minYear,
    maxYear,
}: FiltersProps) {
    const [startYear, setStartYear] = useState(filters.yearRange[0].toString());
    const [endYear, setEndYear] = useState(filters.yearRange[1].toString());
    // Estado para almacenar los tags obtenidos de la base de datos
    const [tags, setTags] = useState<Tag[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Effect para cargar los tags cuando el componente se monta
    useEffect(() => {
        const fetchTags = async () => {
            try {
                setIsLoading(true);
                const fetchedTags = await getTags();
                setTags(fetchedTags);
                setIsLoading(false);
            } catch (err) {
                setError('Error al cargar los tags');
                setIsLoading(false);
                console.error(err);
            }
        };

        fetchTags();
    }, []);

    // Usa formatYear de utils/dateUtils para formatear años y fechas
    // Ejemplo de uso: formatYear(year, 'AC/DC')

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

        // Si estamos en los extremos con mayor tolerancia, devolver exactamente el min o max
        const tolerance = Math.abs(calcLogMaxYear - calcLogMinYear) * 0.01; // 1% del rango

        if (Math.abs(logValue - calcLogMaxYear) <= tolerance) {
            console.log('Devolviendo maxYear:', maxYear);
            return maxYear;
        }
        if (Math.abs(logValue - calcLogMinYear) <= tolerance) {
            console.log('Devolviendo minYear:', minYear);
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
        console.log(
            'logValue:',
            logValue,
            'year calculado:',
            year,
            'clamped:',
            clampedYear
        );
        return clampedYear;
    };

    // Convertimos los valores del rango a escala logarítmica para visualización
    // Memoizamos estos valores para evitar recalculos innecesarios
    const logMinYear = toLogarithmic(minYear);
    const logMaxYear = toLogarithmic(maxYear);
    const logSelectedStart = toLogarithmic(filters.yearRange[0]);
    const logSelectedEnd = toLogarithmic(filters.yearRange[1]);

    // Log para debug
    useEffect(() => {
        console.log('MIN_YEAR:', minYear, 'MAX_YEAR:', maxYear);
        console.log('logMinYear:', logMinYear, 'logMaxYear:', logMaxYear);
    }, [minYear, maxYear, logMinYear, logMaxYear]);

    useEffect(() => {
        setStartYear(filters.yearRange[0].toString());
        setEndYear(filters.yearRange[1].toString());
    }, [filters.yearRange]);

    const handleYearInput = (value: string, isStart: boolean) => {
        if (isStart) {
            setStartYear(value);
        } else {
            setEndYear(value);
        }

        // Intentar actualizar inmediatamente si el valor es válido
        const year = parseInt(value);
        if (!isNaN(year)) {
            if (isStart && year <= filters.yearRange[1]) {
                const newRange: [number, number] = [year, filters.yearRange[1]];
                setSelectedYearRange(newRange);
                setFilters(prev => ({
                    ...prev,
                    yearRange: newRange,
                }));
            } else if (!isStart && year >= filters.yearRange[0]) {
                const newRange: [number, number] = [filters.yearRange[0], year];
                setSelectedYearRange(newRange);
                setFilters(prev => ({
                    ...prev,
                    yearRange: newRange,
                }));
            }
        }
    };

    const handleYearSubmit = (
        e:
            | React.KeyboardEvent<HTMLInputElement>
            | React.FocusEvent<HTMLInputElement>,
        isStart: boolean
    ) => {
        if ('key' in e && e.key !== 'Enter') {
            return;
        }

        const value = isStart ? startYear : endYear;
        let year = parseInt(value);

        if (isNaN(year)) {
            if (isStart) {
                setStartYear(filters.yearRange[0].toString());
            } else {
                setEndYear(filters.yearRange[1].toString());
            }
            return;
        }

        // Validar rango
        if (isStart) {
            year = Math.max(minYear, Math.min(year, filters.yearRange[1]));
            setStartYear(year.toString());
            const newRange: [number, number] = [year, filters.yearRange[1]];
            setSelectedYearRange(newRange);
            setFilters(prev => ({
                ...prev,
                yearRange: newRange,
            }));
        } else {
            year = Math.max(filters.yearRange[0], Math.min(year, maxYear));
            setEndYear(year.toString());
            const newRange: [number, number] = [filters.yearRange[0], year];
            setSelectedYearRange(newRange);
            setFilters(prev => ({
                ...prev,
                yearRange: newRange,
            }));
        }
    };

    const handleRangeChange = (logValue: number, isStart: boolean) => {
        // Calcular los límites con el mismo método que en fromLogarithmic
        const calcLogMaxYear = toLogarithmic(maxYear);
        const calcLogMinYear = toLogarithmic(minYear);
        const tolerance = Math.abs(calcLogMaxYear - calcLogMinYear) * 0.02; // 2% del rango para el slider

        let realYear: number;

        // Detectar si estamos muy cerca de los extremos
        if (Math.abs(logValue - calcLogMaxYear) <= tolerance) {
            realYear = maxYear;
            console.log('Slider en máximo, asignando:', maxYear);
        } else if (Math.abs(logValue - calcLogMinYear) <= tolerance) {
            realYear = minYear;
            console.log('Slider en mínimo, asignando:', minYear);
        } else {
            // Convertimos el valor logarítmico de vuelta a año real
            realYear = fromLogarithmic(logValue);
        }

        if (isStart) {
            if (realYear <= filters.yearRange[1]) {
                const newRange: [number, number] = [
                    realYear,
                    filters.yearRange[1],
                ];
                setStartYear(realYear.toString());
                setSelectedYearRange(newRange);
                setFilters(prev => ({
                    ...prev,
                    yearRange: newRange,
                }));
            }
        } else {
            if (realYear >= filters.yearRange[0]) {
                const newRange: [number, number] = [
                    filters.yearRange[0],
                    realYear,
                ];
                setEndYear(realYear.toString());
                setSelectedYearRange(newRange);
                setFilters(prev => ({
                    ...prev,
                    yearRange: newRange,
                }));
            }
        }
    };

    // Función para alternar filtros
    const toggleFilter = (
        type: 'categories' | 'eventTypes' | 'regions',
        value: string
    ) => {
        setFilters(prev => ({
            ...prev,
            [type]: prev[type].includes(value)
                ? prev[type].filter(v => v !== value)
                : [...prev[type], value],
        }));
    };

    return (
        <div
            className="z-20 flex h-[calc(100vh-120px)] w-[280px] flex-col overflow-hidden rounded-md text-white backdrop-blur-md"
            style={{ pointerEvents: 'auto' }}
        >
            <div className="bg-primary mx-auto flex h-[calc(100vh-120px)] w-[280px] flex-col overflow-hidden p-4 px-4 text-white backdrop-blur-sm dark:bg-black">
                {/* Encabezado */}
                <div className="mb-4 flex flex-none items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        <h2 className="text-lg font-semibold">Filtros</h2>
                    </div>
                    <button
                        onClick={() => {
                            setFilters({
                                search: '',
                                yearRange: [minYear, maxYear],
                                categories: [],
                                eventTypes: [],
                                regions: [],
                            });
                            setSelectedYearRange([minYear, maxYear]);
                        }}
                        className="cursor-pointer text-xs transition-colors hover:text-gray-300"
                    >
                        Limpiar filtros
                    </button>
                </div>

                {/* Buscador de eventos por nombre */}
                <div className="relative mb-6">
                    <input
                        type="text"
                        placeholder="Buscar articulos..."
                        value={filters.search}
                        onChange={e =>
                            setFilters(prev => ({
                                ...prev,
                                search: e.target.value,
                            }))
                        }
                        className="w-full cursor-text rounded-lg bg-white/5 px-4 py-2 pl-10 text-white placeholder-gray-400 focus:ring-2 focus:ring-white/20 focus:outline-none"
                    />
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                </div>

                {/* Rango de años desde un año hasta un año */}
                <h3 className="mb-2 text-sm font-medium">Rango de Años</h3>
                <div className="mb-2 flex gap-4">
                    <div className="flex-1">
                        <label className="mb-1 block text-xs text-gray-400">
                            Desde
                        </label>
                        <input
                            type="text"
                            value={startYear}
                            onChange={e =>
                                handleYearInput(e.target.value, true)
                            }
                            onKeyDown={e => handleYearSubmit(e, true)}
                            onBlur={e => handleYearSubmit(e, true)}
                            className="w-full rounded bg-white/5 px-2 py-1 text-sm focus:ring-2 focus:ring-white/20 focus:outline-none"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="mb-1 block text-xs text-gray-400">
                            Hasta
                        </label>
                        <input
                            type="text"
                            value={endYear}
                            onChange={e =>
                                handleYearInput(e.target.value, false)
                            }
                            onKeyDown={e => handleYearSubmit(e, false)}
                            onBlur={e => handleYearSubmit(e, false)}
                            className="w-full rounded bg-white/5 px-2 py-1 text-sm focus:ring-2 focus:ring-white/20 focus:outline-none"
                        />
                    </div>
                </div>
                <div className="mb-2 flex gap-4">
                    <input
                        type="range"
                        min={logMinYear}
                        max={logMaxYear}
                        value={logSelectedStart}
                        onChange={e =>
                            handleRangeChange(Number(e.target.value), true)
                        }
                        className="w-full cursor-pointer"
                        step="1"
                    />
                    <input
                        type="range"
                        min={logMinYear}
                        max={logMaxYear}
                        value={logSelectedEnd}
                        onChange={e =>
                            handleRangeChange(Number(e.target.value), false)
                        }
                        className="w-full cursor-pointer"
                        step="1"
                    />
                </div>

                {/* Filtros activos */}
                {(filters.categories.length > 0 ||
                    filters.eventTypes.length > 0 ||
                    filters.regions.length > 0) && (
                    <div className="mb-4 flex-none">
                        <h3 className="mb-2 text-sm font-medium">
                            Filtros Activos
                        </h3>
                        <div className="max-h-[120px] overflow-y-auto rounded-lg bg-white/5 p-3 pr-2">
                            <div className="flex flex-wrap gap-2">
                                {[
                                    ...filters.categories,
                                    ...filters.eventTypes,
                                    ...filters.regions,
                                ].map(filter => (
                                    <span
                                        key={filter}
                                        className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs whitespace-nowrap text-white"
                                    >
                                        {filter}
                                        <button
                                            onClick={() => {
                                                setFilters(prev => ({
                                                    ...prev,
                                                    categories:
                                                        prev.categories.filter(
                                                            c => c !== filter
                                                        ),
                                                    eventTypes:
                                                        prev.eventTypes.filter(
                                                            t => t !== filter
                                                        ),
                                                    regions:
                                                        prev.regions.filter(
                                                            r => r !== filter
                                                        ),
                                                }));
                                            }}
                                            className="${filters.categories.includes(filter) ? 'bg-purple-600 text-white' : 'bg-white/5 hover:bg-white/10'} m-0.5 cursor-pointer rounded-full border border-transparent px-2 py-1 text-xs text-gray-300"
                                        >
                                            <X className="h-3 w-3 transition-colors hover:text-red-400" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Categorías */}
                <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                    <div className="rounded-lg bg-white/5 p-3">
                        <h3 className="mb-2 text-sm font-medium">
                            Etapas históricas
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() =>
                                        toggleFilter('categories', category)
                                    }
                                    className={`cursor-pointer rounded-full px-3 py-1 text-xs transition-colors ${
                                        filters.categories.includes(category)
                                            ? 'bg-white/20 text-white'
                                            : 'bg-white/5 text-gray-300 hover:bg-white/10'
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-lg bg-white/5 p-3">
                        <h3 className="mb-2 text-sm font-medium">
                            Tipos de Eventos
                        </h3>
                        {isLoading ? (
                            <p className="text-xs text-gray-400">
                                Cargando tags...
                            </p>
                        ) : error ? (
                            <p className="text-xs text-red-400">{error}</p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {tags.map(tag => (
                                    <button
                                        key={tag.id}
                                        onClick={() =>
                                            toggleFilter('eventTypes', tag.name)
                                        }
                                        className={`cursor-pointer rounded-full px-3 py-1 text-xs transition-colors ${
                                            filters.eventTypes.includes(
                                                tag.name
                                            )
                                                ? 'bg-white/20 text-white'
                                                : 'bg-white/5 text-gray-300 hover:bg-white/10'
                                        }`}
                                    >
                                        {tag.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <h3 className="mb-2 text-sm font-medium">Regiones</h3>
                    <div className="flex flex-wrap gap-2">
                        {regions.map(region => (
                            <button
                                key={region}
                                onClick={() => toggleFilter('regions', region)}
                                className={`cursor-pointer rounded-full px-3 py-1 text-xs transition-colors ${
                                    filters.regions.includes(region)
                                        ? 'bg-white/20 text-white'
                                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                                }`}
                            >
                                {region}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
