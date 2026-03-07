"use client";

import { BookOpen } from "lucide-react";
import { useRef, useEffect } from "react";

interface ArticleBibliographyProps {
    bibliografia: string;
    setBibliografia: (val: string) => void;
}

export function ArticleBibliography({ bibliografia, setBibliografia }: ArticleBibliographyProps) {
    const bibliografiaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (bibliografiaRef.current) {
            bibliografiaRef.current.style.height = 'auto';
            bibliografiaRef.current.style.height = `${bibliografiaRef.current.scrollHeight}px`;
        }
    }, [bibliografia]);

    return (
        <section className="space-y-4 pt-10 border-t">
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-3">
                <BookOpen className="size-5 text-accent" />
                Bibliografía
            </h2>
            <textarea
                placeholder="Cita tus fuentes aquí..."
                ref={bibliografiaRef}
                value={bibliografia}
                onChange={(e) => setBibliografia(e.target.value)}
                className="w-full bg-white/5 backdrop-blur-sm border rounded-md p-6 outline-none focus:border-accent/40 transition-all resize-none min-h-[120px]"
            />
        </section>
    );
}
