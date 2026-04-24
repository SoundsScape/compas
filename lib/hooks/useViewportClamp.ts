import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';

interface UseViewportClampOptions {
    padding?: number;
    topPadding?: number;
    bottomPadding?: number;
}

interface ClampOffset {
    x: number;
    y: number;
}

export function useViewportClamp({
    padding = 16,
    topPadding = 92,
    bottomPadding = 16,
}: UseViewportClampOptions = {}) {
    const ref = useRef<HTMLDivElement>(null);
    const frameRef = useRef<number | null>(null);
    const [offset, setOffset] = useState<ClampOffset>({ x: 0, y: 0 });
    const [isClampReady, setIsClampReady] = useState(false);

    const updateClamp = useCallback(() => {
        const element = ref.current;
        if (!element || typeof window === 'undefined') return;

        const rect = element.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let dx = 0;
        let dy = 0;

        if (rect.left < padding) {
            dx = padding - rect.left;
        } else if (rect.right > viewportWidth - padding) {
            dx = viewportWidth - padding - rect.right;
        }

        if (rect.top < topPadding) {
            dy = topPadding - rect.top;
        } else if (rect.bottom > viewportHeight - bottomPadding) {
            dy = viewportHeight - bottomPadding - rect.bottom;
        }

        setOffset(prev => {
            const next = {
                x: prev.x + Math.round(dx),
                y: prev.y + Math.round(dy),
            };
            if (prev.x === next.x && prev.y === next.y) {
                return prev;
            }
            return next;
        });

        setIsClampReady(true);
    }, [bottomPadding, padding, topPadding]);

    useLayoutEffect(() => {
        setIsClampReady(false);
        updateClamp();
    }, [updateClamp]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const tick = () => {
            updateClamp();
            frameRef.current = window.requestAnimationFrame(tick);
        };

        frameRef.current = window.requestAnimationFrame(tick);
        window.addEventListener('resize', updateClamp);
        window.addEventListener('scroll', updateClamp, true);

        const observer = new ResizeObserver(() => updateClamp());
        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (frameRef.current !== null) {
                window.cancelAnimationFrame(frameRef.current);
                frameRef.current = null;
            }
            window.removeEventListener('resize', updateClamp);
            window.removeEventListener('scroll', updateClamp, true);
            observer.disconnect();
        };
    }, [updateClamp]);

    return {
        clampRef: ref,
        clampTransform: `translate(${offset.x}px, ${offset.y}px)`,
        isClampReady,
    };
}
