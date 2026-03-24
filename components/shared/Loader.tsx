import { Loader2 } from 'lucide-react'
import React from 'react'

export default function Loader() {
    return (
        <div className="flex h-[60vh] items-center justify-center">
            <Loader2 className="size-8 animate-spin text-accent" />
        </div>

    )
}
