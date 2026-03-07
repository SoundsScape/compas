
import React, { useEffect, useRef, useState } from "react";
import { ImageIcon, Type, Upload } from "lucide-react";

interface ImageBlockProps {
    imageArea: ImageArea;
    onFileChange: (file: File | null) => void;
    onFootChange: (foot: string) => void;
}
export interface ImageArea {
    imageFile?: File | string | null;
    imageFooter?: string;
}

export default function ImageBlock({ imageArea, onFileChange, onFootChange }: ImageBlockProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [imageFoot, setImageFoot] = useState(imageArea.imageFooter ?? '');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync imageFoot if prop changes (important for reordering)
    useEffect(() => {
        setImageFoot(imageArea.imageFooter ?? '');
    }, [imageArea.imageFooter]);

    // Handle existing images (strings) or new files
    useEffect(() => {
        if (typeof imageArea.imageFile === 'string') {
            setImageUrl(imageArea.imageFile);
        } else if (imageArea.imageFile instanceof File) {
            const reader = new FileReader();
            reader.onloadend = () => setImageUrl(reader.result as string);
            reader.readAsDataURL(imageArea.imageFile);
        } else {
            setImageUrl(null);
        }
    }, [imageArea.imageFile]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onFileChange(file);
        } else {
            onFileChange(null);
        }
    };

    const handleImageClick = () => fileInputRef.current?.click();

    const handleFootChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const foot = event.target.value;
        setImageFoot(foot);
        onFootChange(foot);
    };

    return (
        <div className="flex flex-col gap-3 w-full bg-background/20 backdrop-blur-md border rounded-lg p-3 group transition-all duration-300 hover:border-accent/30">
            <div
                onClick={handleImageClick}
                className="relative aspect-3/2 w-full rounded-md overflow-hidden bg-white/5 border border-dashed  hover:border-accent/40 cursor-pointer transition-all flex items-center justify-center group/img"
            >
                {imageUrl ? (
                    <>
                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                            <Upload className="text-white size-8" />
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-accent/70 transition-colors">
                        <ImageIcon className="size-10" />
                        <span className="text-xs font-medium uppercase tracking-wider">Cargar Imagen</span>
                    </div>
                )}
                <input onChange={handleFileChange} ref={fileInputRef} className="hidden" type="file" name="image" accept="image/*" />
            </div>

            <div className="relative flex items-center">
                <Type className="absolute left-3 size-4 text-muted-foreground/60" />
                <input
                    className="w-full pl-9 pr-4 py-2 bg-white/5 border rounded-md text-sm focus:border-accent/50 focus:ring-1 focus:ring-accent/30 outline-none transition-all placeholder:text-muted-foreground/40"
                    type="text"
                    placeholder="Pie de imagen..."
                    value={imageFoot}
                    onChange={handleFootChange}
                />
            </div>
        </div>
    );
}
