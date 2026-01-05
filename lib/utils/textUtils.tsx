/**
 * Limita un texto a un número específico de palabras y añade puntos suspensivos
 * @param text Texto a limitar
 * @param wordLimit Número máximo de palabras (por defecto 15)
 * @returns Texto limitado con puntos suspensivos si excede el límite
 */
export const limitWords = (text: string, wordLimit: number = 15): string => {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
};
