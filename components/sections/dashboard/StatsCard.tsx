import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
    title: string
    value: string | number
    icon: LucideIcon
}

export function StatsCard({ title, value, icon: Icon }: StatsCardProps) {
    return (
        <Card className="relative shadow-none p-0 border-l-4 border-accent">
            <CardContent className="p-4 flex items-start gap-3 z-10">
                <div className="p-1.5 bg-background/50 rounded-sm">
                    <Icon className="size-6 text-accent" />
                </div>
                <div className="flex flex-col">
                    <span className="text-md font-medium text-foreground/90">{title}</span>
                    <span className="text-2xl font-bold">{value}</span>
                </div>
            </CardContent>
        </Card>
    )
}
