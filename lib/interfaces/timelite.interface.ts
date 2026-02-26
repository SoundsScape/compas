export interface TimelineProps {
    selectedYearRange: [number, number];
    setSelectedYearRange: (range: [number, number]) => void;
    minYear: number;
    maxYear: number;
    dateFormat?: 'AC/DC' | 'BCE/CE';
}
