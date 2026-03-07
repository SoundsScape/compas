"use client";

import { MapPin, Calendar } from "lucide-react";
import AsyncSelect from "react-select/async";
import { OptionType } from "@/lib/hooks/useTags";

interface ArticleMetadataFormProps {
    titulo: string;
    setTitulo: (val: string) => void;
    location: OptionType | null;
    setLocation: (val: OptionType | null) => void;
    fecha: number;
    setFecha: (val: number) => void;
    loadCityOptions: (inputValue: string, callback: (options: OptionType[]) => void) => void;
    currentYear: number;
    customSelectStyles: any;
}

export function ArticleMetadataForm({
    titulo,
    setTitulo,
    location,
    setLocation,
    fecha,
    setFecha,
    loadCityOptions,
    currentYear,
    customSelectStyles
}: ArticleMetadataFormProps) {
    return (
        <div className="md:col-span-2 space-y-6">
            <div className="space-y-2 group">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-focus-within:text-accent transition-colors">
                    Título del Artículo
                </label>
                <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Escribe un título impactante..."
                    className="w-full text-2xl font-semibold bg-transparent border-b py-2 outline-none focus:border-accent transition-all placeholder:text-muted-foreground/30"
                />
            </div>

            <div className="flex gap-3 sm:gap-6">
                <div className="space-y-2 flex-1">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <MapPin className="size-3" /> Lugar de los Hechos
                    </label>
                    <AsyncSelect
                        cacheOptions
                        loadOptions={loadCityOptions}
                        value={location}
                        onChange={setLocation}
                        placeholder="Buscar ciudad..."
                        styles={customSelectStyles}
                        noOptionsMessage={() => "Busca una ciudad..."}
                    />
                </div>
                <div className="space-y-2 w-24 sm:w-32">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Calendar className="size-3" /> Año
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            value={fecha}
                            onChange={(e) => setFecha(parseInt(e.target.value))}
                            max={currentYear}
                            className="w-full bg-white/5 border h-10 px-4 rounded-md outline-none focus:border-accent/50 transition-all font-mono"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
