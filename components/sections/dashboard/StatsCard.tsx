import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
    title: string
    value: string | number
    icon: LucideIcon
}

export function StatsCard({ title, value, icon: Icon }: StatsCardProps) {
    return (
        <Card>
            <CardContent className="px-5 flex items-center gap-4">
                <div className="p-3 bg-background/50 rounded-md">
                    <Icon className="size-10 text-accent/80" />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</span>
                    <span className="text-4xl font-bold">{value}</span>
                </div>
            </CardContent>
        </Card>
    )
}
