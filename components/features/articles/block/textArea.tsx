import React from "react";
import { useState, useRef, useEffect } from "react";

interface TextAreaProps {
    maxCharacters: number;
    textArea: string;
    onChange: (value: string) => void;
    placeholder: string;
}

export default function TextArea({ textArea, onChange, maxCharacters, placeholder }: TextAreaProps) {
    const [text, setText] = useState(textArea ?? '');
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setText(newValue);
        onChange(newValue);
    };

    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "auto";
            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
        }
    }, [text]);

    // Update internal state if prop changes (for reordering/resetting)
    useEffect(() => {
        setText(textArea);
    }, [textArea]);

    return (
        <div className="flex flex-col gap-2 w-full relative group">
            <textarea
                placeholder={placeholder}
                ref={textAreaRef}
                maxLength={maxCharacters}
                className="w-full resize-none outline-none p-4 bg-background/20 backdrop-blur-md border rounded-md focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all duration-300 text-foreground placeholder:text-muted-foreground/50"
                value={text}
                onChange={handleChange}
                rows={maxCharacters > 500 ? 6 : 3}
                style={{ overflow: "hidden" }}
            />
            <div className={`absolute right-3 bottom-2 text-[10px] font-mono tracking-wider transition-colors duration-300 ${text.length >= maxCharacters ? 'text-destructive' : 'text-muted-foreground group-focus-within:text-accent/70'}`}>
                {text.length} / {maxCharacters}
            </div>
        </div>
    );
}
