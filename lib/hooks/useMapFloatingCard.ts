import { useCallback, useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';

interface UseMapFloatingCardOptions {
    markerPosition: [number, number];
    cardSelector?: string;
}

interface CardPosition {
    left: number;
    top: number;
}

export function useMapFloatingCard({
    markerPosition,
    cardSelector = '.map-floating-article-card',
}: UseMapFloatingCardOptions) {
    const map = useMap();
    const [isCardOpen, setIsCardOpen] = useState(false);
    const [cardPosition, setCardPosition] = useState<CardPosition>({
        left: 0,
        top: 0,
    });

    const closeCard = useCallback(() => {
        setIsCardOpen(false);
    }, []);

    const updateCardPosition = useCallback(() => {
        const mapElement = map.getContainer();
        const mapRect = mapElement.getBoundingClientRect();
        const markerPoint = map.latLngToContainerPoint(markerPosition);

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const cardWidth = Math.min(viewportWidth * 0.86, 320);
        const cardHeight = 360;

        const topSafe = 92;
        const leftSafe = viewportWidth >= 1024 ? 20 : 16;
        const rightSafe = 60;
        const bottomSafe = viewportWidth >= 1280 ? 140 : 16;

        let left = mapRect.left + markerPoint.x - cardWidth / 2;
        let top = mapRect.top + markerPoint.y - cardHeight - 24;

        const minLeft = leftSafe;
        const maxLeft = viewportWidth - rightSafe - cardWidth;
        const minTop = topSafe;
        const maxTop = viewportHeight - bottomSafe - cardHeight;

        if (top < minTop) {
            top = mapRect.top + markerPoint.y + 24;
        }

        left = Math.max(minLeft, Math.min(left, maxLeft));
        top = Math.max(minTop, Math.min(top, maxTop));

        setCardPosition({
            left: Math.round(left),
            top: Math.round(top),
        });
    }, [map, markerPosition]);

    const openCard = useCallback(() => {
        setIsCardOpen(true);
        updateCardPosition();
    }, [updateCardPosition]);

    useEffect(() => {
        if (!isCardOpen) return;

        updateCardPosition();
        map.on('move', updateCardPosition);
        map.on('resize', updateCardPosition);
        map.on('zoomstart', closeCard);

        return () => {
            map.off('move', updateCardPosition);
            map.off('resize', updateCardPosition);
            map.off('zoomstart', closeCard);
        };
    }, [closeCard, isCardOpen, map, updateCardPosition]);

    useEffect(() => {
        if (!isCardOpen) return;

        const handleOutsideClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement | null;
            const clickedInsideCard = target?.closest(cardSelector);
            if (!clickedInsideCard) {
                closeCard();
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () =>
            document.removeEventListener('mousedown', handleOutsideClick);
    }, [cardSelector, closeCard, isCardOpen]);

    return {
        isCardOpen,
        cardPosition,
        openCard,
        closeCard,
    };
}
