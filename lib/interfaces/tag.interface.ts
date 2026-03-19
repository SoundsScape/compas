export interface Tag {
    id: number;
    name: string;
    articlesCount?: number;
    created_at?: string;
    updated_at?: string;
}

export interface CreateTag {
    name: string;
}
