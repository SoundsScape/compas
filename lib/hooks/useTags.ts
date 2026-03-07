import { useState, useEffect } from "react";
import { getTags } from "../services/tagService";
import { Tag } from "../interfaces/tag.interface";

export interface OptionType {
    value: string;
    label: string;
}

export function useTags() {
    const [options, setOptions] = useState<OptionType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                setLoading(true);
                const response = await getTags();
                // Handle both direct array and { data: [...] } structure
                const tags = Array.isArray(response) ? response : (response as any).data || [];

                const formattedTags = tags.map((tag: Tag) => ({
                    value: String(tag.id),
                    label: tag.name,
                }));
                setOptions(formattedTags);
            } catch (error) {
                console.error("Error fetching tags:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTags();
    }, []);

    return { options, loading };
}
