import Tag from './Tag'
import { Badge } from '@/components/ui/badge'
import { Trash2 } from 'lucide-react'
import { OptionType } from '@/lib/hooks/useTags'

interface TagsWrapperProps {
    tagOptions: OptionType[];
    selectedTags: OptionType[];
    handleTagChange: (tag: OptionType | null) => void;
    removeTag: (value: string) => void;
}

export default function TagsWrapper({
    tagOptions,
    selectedTags,
    handleTagChange,
    removeTag
}: TagsWrapperProps) {
    return (
        <div className="flex flex-col space-y-3">
            <div className="flex flex-col space-y-2 max-w-sm">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Etiquetas
                </label>
                <Tag options={tagOptions} onChange={handleTagChange} />
            </div>

            <div className="flex flex-wrap gap-2">
                {selectedTags.map(tag => (
                    <Badge
                        key={tag.value}
                        variant="secondary"
                        className="bg-accent/10 border border-accent/20 rounded text-xs uppercase font-medium text-accent flex items-center gap-1.5 py-1 animate-in zoom-in-50"
                    >
                        {tag.label}
                        <button
                            type="button"
                            onClick={() => removeTag(tag.value)}
                            className="hover:text-destructive transition-colors"
                        >
                            <Trash2 className="size-3.5" />
                        </button>
                    </Badge>
                ))}
            </div>
        </div>
    )
}
