import { ChevronDown, ChevronUp } from 'lucide-react';
import Timeline from './Timeline';
import { Button } from '@/components/ui/button';
import { TimelinePanelProps } from '@/lib/interfaces/timelite.interface';
import { MAX_YEAR, MIN_YEAR } from '@/lib/constants/yearsRange';

export function TimelinePanel({
    selectedYearRange,
    setSelectedYearRange,
    dateFormat,
    showTimeline,
    setShowTimeline,
}: TimelinePanelProps) {
    return (
        <div
            className={`pointer-events-auto fixed bottom-6 left-1/2 z-10 w-[45%] ml-6 -translate-x-1/2 max-w-3xl items-start gap-1 transition-all duration-300 hidden xl:flex print:hidden ${showTimeline ? 'translate-y-24' : ''}`}
        >
            <div
                className={`transition-all duration-400 flex-1 ${showTimeline ? 'opacity-0' : 'opacity-100'}`}
            >
                <Timeline
                    selectedYearRange={selectedYearRange}
                    setSelectedYearRange={setSelectedYearRange}
                    dateFormat={dateFormat}
                />
            </div>
            <Button
                onClick={() => setShowTimeline(!showTimeline)}
                variant="control"
                size="icon-lg"
                className='bg-linear-to-bl'
            >
                {showTimeline ? (
                    <ChevronUp className="size-5.5" />
                ) : (
                    <ChevronDown className="size-5.5" />
                )}
            </Button>
        </div>
    );
}
