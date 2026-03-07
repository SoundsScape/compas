"use client";

import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ArticleHeaderProps {
    isSubmitting: boolean;
    isValid: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

export function ArticleHeader({ isSubmitting, isValid, onSubmit }: ArticleHeaderProps) {
    return (
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="h-px w-8 bg-accent/60"></span>
                    <span className="text-xs font-mono tracking-widest uppercase text-accent/80">Redacción</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-sans font-bold tracking-tight bg-linear-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
                    Crear nuevo artículo
                </h1>
            </div>

            <div className="flex items-center gap-3">
                <Button
                    onClick={onSubmit}
                    disabled={isSubmitting || !isValid}
                    className="group relative flex items-center gap-2 px-6 py-2.5 bg-accent text-accent-foreground font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                >
                    {isSubmitting ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        <Save className="size-4 transition-transform group-hover:rotate-12" />
                    )}
                    <span className="uppercase tracking-wider text-xs">Publicar Artículo</span>
                </Button>
            </div>
        </header>
    );
}
