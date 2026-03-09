import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react'

interface ArticleFooterProps {
    isSubmitting: boolean;
    isValid: boolean;
    onSubmit: (e: React.FormEvent) => void;
    isEdit?: boolean;
}

export default function ArticleFooter({ isSubmitting, isValid, onSubmit, isEdit }: ArticleFooterProps) {
    return (
        <footer className="flex justify-center pt-10">
            <Button
                onClick={onSubmit}
                disabled={isSubmitting || !isValid}
                className="group relative flex items-center gap-4 h-14 w-80 bg-accent text-accent-foreground font-black overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            >
                <span className="uppercase tracking-[0.2em] text-sm">
                    {isEdit ? "Guardar Cambios" : "Publicar Artículo"}
                </span>
                {isSubmitting ? (
                    <Loader2 className="size-5 animate-spin" />
                ) : (
                    <Save className="size-5 transition-transform group-hover:rotate-12" />
                )}
            </Button>
        </footer>
    )
}
