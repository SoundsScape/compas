"use client";

import { Newspaper, Plus, ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import Plantilla1 from "@/components/features/articles/templates/Template1";
import Plantilla2 from "@/components/features/articles/templates/Template2";
import { Plantilla } from "@/lib/interfaces/article.interface";
import { Button } from "@/components/ui/button";

interface ArticleContentEditorProps {
    plantillaData: Plantilla[];
    addPlantilla: (tipo: "plantilla1" | "plantilla2") => void;
    removePlantilla: (id: number) => void;
    movePlantilla: (idx: number, direction: "up" | "down") => void;
    setPlantillaData: (data: Plantilla[]) => void;
}

export function ArticleContentEditor({
    plantillaData,
    addPlantilla,
    removePlantilla,
    movePlantilla,
    setPlantillaData
}: ArticleContentEditorProps) {
    return (
        <section className="space-y-8 mt-12">
            <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-xl font-semibold">
                    Cuerpo del Artículo
                </h2>
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => addPlantilla("plantilla1")}
                        className="flex items-center gap-2 px-3 bg-border/50 hover:bg-primary/50 hover:text-accent border text-xs font-semibold uppercase tracking-wider"
                    >
                        <Plus className="size-4 text-accent" /> Bloque con Imagen
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => addPlantilla("plantilla2")}
                        className="flex items-center gap-2 px-3 bg-border/50 hover:bg-primary/50 hover:text-accent border text-xs font-semibold uppercase tracking-wider"
                    >
                        <Plus className="size-4 text-accent" /> Bloque de Texto
                    </Button>
                </div>
            </div>

            <div className="space-y-12 min-h-[200px]">
                {plantillaData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-border/50 rounded-lg text-muted-foreground/30">
                        <Newspaper className="size-16 mb-4 opacity-50" />
                        <p className="text-lg font-medium">Empieza a construir tu historia</p>
                        <p className="text-sm">Añade un bloque de contenido arriba</p>
                    </div>
                ) : (
                    plantillaData.map((data, idx) => (
                        <div key={data.id} className="group relative animate-in fade-in slide-in-from-bottom-8 duration-500">
                            {/* Toolbar lateral */}
                            <div className="absolute -left-12 top-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    type="button"
                                    onClick={() => movePlantilla(idx, "up")}
                                    disabled={idx === 0}
                                    className="p-1.5 bg-white/5 hover:bg-white/10 rounded border disabled:opacity-30"
                                >
                                    <ChevronUp className="size-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => movePlantilla(idx, "down")}
                                    disabled={idx === plantillaData.length - 1}
                                    className="p-1.5 bg-white/5 hover:bg-white/10 rounded border disabled:opacity-30"
                                >
                                    <ChevronDown className="size-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => removePlantilla(data.id)}
                                    className="p-1.5 bg-destructive/10 hover:bg-destructive/20 rounded border border-destructive/20 text-destructive mt-2"
                                >
                                    <Trash2 className="size-4" />
                                </button>
                            </div>

                            {data.tipo === "plantilla1" ? (
                                <Plantilla1
                                    index={idx}
                                    textAreas={data.textAreas}
                                    imageAreas={data.imageAreas}
                                    shortCitation={data.shortCitation}
                                    setTextAreas={(newArray) => {
                                        const p = [...plantillaData];
                                        p[idx].textAreas = newArray;
                                        setPlantillaData(p);
                                    }}
                                    setImageAreas={(newArray) => {
                                        const p = [...plantillaData];
                                        p[idx].imageAreas = newArray;
                                        setPlantillaData(p);
                                    }}
                                    setShortCitation={(val) => {
                                        const p = [...plantillaData];
                                        p[idx].shortCitation = val;
                                        setPlantillaData(p);
                                    }}
                                />
                            ) : (
                                <Plantilla2
                                    index={idx}
                                    textAreas={data.textAreas}
                                    shortCitation={data.shortCitation}
                                    setTextAreas={(newArray) => {
                                        const p = [...plantillaData];
                                        p[idx].textAreas = newArray;
                                        setPlantillaData(p);
                                    }}
                                    setShortCitation={(val) => {
                                        const p = [...plantillaData];
                                        p[idx].shortCitation = val;
                                        setPlantillaData(p);
                                    }}
                                />
                            )}
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
