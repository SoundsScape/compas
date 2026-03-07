"use client";

import { User as UserIcon, School as SchoolIcon } from "lucide-react";
import { OptionType } from "@/lib/hooks/useTags";

interface ArticleSidebarProps {
    nombre_autor: string;
    apellidos_autor: string;
    centro: string;
    setCentro: (val: string) => void;
    userRole: string;
    tagOptions: OptionType[];
    selectedTags: OptionType[];
    handleTagChange: (tag: OptionType | null) => void;
    removeTag: (value: string) => void;
}

export function ArticleSidebar({
    nombre_autor,
    apellidos_autor,
    centro,
    setCentro,
    userRole,
    handleTagChange,
    removeTag
}: ArticleSidebarProps) {
    const canEditInstitution = userRole === "admin" || userRole === "superadmin";

    return (
        <aside className="bg-border/50 backdrop-blur-md border rounded-md p-6 space-y-6 self-start">
            <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    Autoría
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                            <UserIcon className="size-4" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground mb-0.5 font-semibold tracking-wider">Autor</p>
                            <p className="text-sm">{nombre_autor} {apellidos_autor}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 w-full">
                        <div className="size-8 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0">
                            <SchoolIcon className="size-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground mb-0.5 font-semibold tracking-wider">Institución</p>
                            <input
                                type="text"
                                value={centro}
                                onChange={(e) => setCentro(e.target.value)}
                                placeholder="Nombre del centro..."
                                readOnly={!canEditInstitution}
                                className={`w-full bg-transparent text-sm font-medium outline-none border-b border-transparent transition-all placeholder:text-white/10 ${canEditInstitution
                                    ? "focus:border-accent/40 hover:border-white/10"
                                    : "cursor-default text-muted-foreground"
                                    }`}
                            />
                        </div>
                    </div>
                </div>
            </div>            
        </aside>
    );
}
