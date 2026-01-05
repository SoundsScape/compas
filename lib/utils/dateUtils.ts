// Utilidades para parsear y formatear fechas compatibles con Safari y Apple

export function parseSafeDate(dateInput: string | number): Date | null {
    if (typeof dateInput === 'number') {
        return new Date(dateInput);
    }
    // Si ya es ISO con T y zona, úsalo directamente
    if (/T.*(Z|[+-]\d{2}:\d{2})$/.test(dateInput)) {
        return new Date(dateInput);
    }
    // Si es solo YYYY-MM-DD, conviértelo a ISO
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
        return new Date(dateInput + 'T00:00:00Z');
    }
    // Si no, intenta parsear normal
    return new Date(dateInput);
}

export function formatYear(
    year: number | string | Date,
    dateFormat: 'AC/DC' | 'BCE/CE' = 'AC/DC'
) {
    if (typeof year === 'number' && year < 0) {
        return `${Math.abs(year)} ${dateFormat === 'AC/DC' ? 'a.C.' : 'BCE'}`;
    }
    if (typeof year === 'number') {
        return `${year} ${dateFormat === 'AC/DC' ? 'd.C.' : 'CE'}`;
    }
    const dateObj = typeof year === 'string' ? parseSafeDate(year) : year;
    if (dateObj instanceof Date && !isNaN(dateObj.getTime())) {
        return dateObj.toLocaleString('es-ES', { timeZone: 'Europe/Madrid' });
    }
    return String(year);
}
