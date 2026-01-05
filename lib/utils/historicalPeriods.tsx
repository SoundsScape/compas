// Definición de las etapas históricas y sus rangos de años
export const HISTORICAL_PERIODS = [
    { name: 'Prehistoria', start: -35000, end: -3000 },
    { name: 'Antigüedad', start: -3000, end: 476 },
    { name: 'Edad Media', start: 476, end: 1492 },
    { name: 'Renacimiento', start: 1492, end: 1600 },
    { name: 'Barroco', start: 1600, end: 1750 },
    { name: 'Clasicismo', start: 1750, end: 1820 },
    { name: 'Romanticismo', start: 1820, end: 1900 },
    { name: 'Modernismo', start: 1900, end: 1945 },
    { name: 'Era Digital', start: 1945, end: 2100 },
];

// Función para determinar la etapa histórica según el año
export function getHistoricalPeriod(year: number): string {
    const period = HISTORICAL_PERIODS.find(
        period => year >= period.start && year <= period.end
    );
    return period ? period.name : 'Desconocido';
}

// Función para obtener todas las etapas históricas como un array de nombres
export function getAllHistoricalPeriodNames(): string[] {
    return HISTORICAL_PERIODS.map(period => period.name);
}
