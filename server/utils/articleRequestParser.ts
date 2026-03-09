import { saveFileLocally } from "./uploadUtils";

/**
 * Utility to parse complex article FormData into a structured object for ArticleService.
 */
export async function parseArticleFormData(formData: FormData, userId: number) {
    const body: any = {};

    if (formData.has("titulo")) body.titulo = formData.get("titulo");
    if (formData.has("nombre_autor")) body.nombre_autor = formData.get("nombre_autor");
    if (formData.has("apellidos_autor")) body.apellidos_autor = formData.get("apellidos_autor");
    if (formData.has("centro")) body.centro = formData.get("centro");
    if (formData.has("bibliografia")) body.bibliografia = formData.get("bibliografia");
    if (formData.has("latitud")) body.latitud = formData.get("latitud");
    if (formData.has("longitud")) body.longitud = formData.get("longitud");

    if (formData.has("fecha")) {
        const fechaVal = formData.get("fecha");
        if (fechaVal !== null && fechaVal !== "") {
            body.fecha = parseInt(fechaVal as string);
        }
    }

    body.id_autor = userId.toString();

    // Process Tags
    const tags: number[] = [];
    let tagIndex = 0;
    while (formData.has(`tags[${tagIndex}]`)) {
        const tagId = parseInt(formData.get(`tags[${tagIndex}]`) as string);
        if (!isNaN(tagId)) {
            tags.push(tagId);
        }
        tagIndex++;
    }
    if (tagIndex > 0) {
        body.tags = tags;
    }

    // Process Plantillas
    const plantillas: any[] = [];
    let pIndex = 0;
    while (formData.has(`plantillas[${pIndex}][tipo]`)) {
        const plantilla: any = {
            tipo: formData.get(`plantillas[${pIndex}][tipo]`),
            order: parseInt(formData.get(`plantillas[${pIndex}][order]`) as string) || 0,
            shortCitation: formData.get(`plantillas[${pIndex}][shortCitation]`),
            textAreas: [],
            imageAreas: []
        };

        // Process TextAreas
        let taIndex = 0;
        while (formData.has(`plantillas[${pIndex}][textAreas][${taIndex}][value]`)) {
            plantilla.textAreas.push({
                value: formData.get(`plantillas[${pIndex}][textAreas][${taIndex}][value]`),
                order: taIndex
            });
            taIndex++;
        }

        // Process ImageAreas
        let iaIndex = 0;
        while (formData.has(`plantillas[${pIndex}][imageAreas][${iaIndex}][imageFooter]`)) {
            const imageFile = formData.get(`plantillas[${pIndex}][imageAreas][${iaIndex}][imageFile]`);
            let imagePath = formData.get(`plantillas[${pIndex}][imageAreas][${iaIndex}][imagePath]`) as string || "";

            if (imageFile instanceof File) {
                const MAX_SIZE = 4 * 1024 * 1024; // 4MB
                if (imageFile.size > MAX_SIZE) {
                    throw { status: 400, message: `La imagen ${imageFile.name} excede el límite de 4MB.` };
                }
                imagePath = await saveFileLocally(imageFile);
            }

            plantilla.imageAreas.push({
                imagePath,
                imageFooter: formData.get(`plantillas[${pIndex}][imageAreas][${iaIndex}][imageFooter]`),
                order: iaIndex
            });
            iaIndex++;
        }

        plantillas.push(plantilla);
        pIndex++;
    }

    if (pIndex > 0) {
        body.plantillas = plantillas;
    }

    return body;
}
