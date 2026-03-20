export interface TimelineProps {
    selectedYearRange: [number, number];
    setSelectedYearRange: (range: [number, number]) => void;
    dateFormat?: 'AC/DC' | 'BCE/CE';
}

export interface TimelinePanelProps {
    showTimeline: boolean;
    setShowTimeline: (show: boolean) => void;
    selectedYearRange: [number, number];
    setSelectedYearRange: (range: [number, number]) => void;
    dateFormat?: 'AC/DC' | 'BCE/CE';
}
