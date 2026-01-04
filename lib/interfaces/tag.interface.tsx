export interface Tag {
    id: number;
    name: string;
    created_at: Date;
    updated_at: Date;
}

export interface CreateTag {
    name: string;
}
