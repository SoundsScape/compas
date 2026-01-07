export interface Article {
    id: number;
    titulo: string;
    nombre_autor: string;
    apellidos_autor: string;
    id_autor: number;
    centro: string;
    validated: boolean;
    latitud: string;
    longitud: string;
    bibliografia: string;
    fecha: number;
    created_at: string;
    updated_at: string;
    templates?: ArticleTemplate[];
    tags?: Tag[];
}

export interface ArticleTemplate {
    id: number;
    type: string;
    order: number;
    shortCitation: string;
    article_id: number;
    created_at: string;
    updated_at: string;
    text_areas: TextArea[];
    image_areas: ImageArea[];
}

export interface TextArea {
    id: number;
    content: string;
    order: number;
    template_id: number;
    created_at: string;
    updated_at: string;
}

export interface ImageArea {
    id: number;
    imagePath: string;
    imageFooter: string;
    order: number;
    template_id: number;
    created_at: string;
    updated_at: string;
}

export interface Tag {
    id: number;
    name: string;
    pivot: TagPivot;
    created_at: string;
    updated_at: string;
}

export interface TagPivot {
    article_id: number;
    tag_id: number;
    created_at: string;
    updated_at: string;
}
