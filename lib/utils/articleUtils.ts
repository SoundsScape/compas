import { ArticleFormData } from "../interfaces/article.interface";
import { City } from "../hooks/useCities";

/**
 * Validates the article form data.
 */
export const validateArticleForm = (data: ArticleFormData): boolean => {
    const { titulo, location, bibliografia, centro, plantillaData } = data;

    if (!titulo || !location || !bibliografia || !centro || plantillaData.length === 0) {
        return false;
    }

    return plantillaData.every(p => {
        const textFilled = p.textAreas.every(ta => ta.value.trim().length > 0);
        const imagesFilled = p.tipo === "plantilla1"
            ? p.imageAreas.every(ia => ia.imageFile !== null)
            : true;
        return textFilled && imagesFilled;
    });
};

/**
 * Prepares the FormData object for the article creation request.
 */
export const prepareArticleFormData = (data: ArticleFormData, cities: City[]): FormData => {
    const formData = new FormData();
    const {
        titulo, nombre_autor, apellidos_autor, centro,
        bibliografia, fecha, location, selectedTags, plantillaData
    } = data;

    formData.append("titulo", titulo);
    formData.append("nombre_autor", nombre_autor);
    formData.append("apellidos_autor", apellidos_autor);
    formData.append("centro", centro);
    formData.append("bibliografia", bibliografia);
    formData.append("fecha", fecha.toString());

    const city = cities.find(c => c.id === location?.value);
    if (city) {
        formData.append("latitud", city.lat);
        formData.append("longitud", city.lng);
    }

    selectedTags.forEach((tag, i) => {
        formData.append(`tags[${i}]`, tag.value);
    });

    plantillaData.forEach((p, i) => {
        formData.append(`plantillas[${i}][tipo]`, p.tipo);
        formData.append(`plantillas[${i}][order]`, i.toString());
        formData.append(`plantillas[${i}][shortCitation]`, p.shortCitation);

        p.textAreas.forEach((ta, j) => {
            formData.append(`plantillas[${i}][textAreas][${j}][value]`, ta.value);
        });

        if (p.tipo === "plantilla1") {
            p.imageAreas.forEach((ia, j) => {
                if (ia.imageFile instanceof File) {
                    formData.append(`plantillas[${i}][imageAreas][${j}][imageFile]`, ia.imageFile);
                } else if (typeof ia.imageFile === 'string') {
                    formData.append(`plantillas[${i}][imageAreas][${j}][imagePath]`, ia.imageFile);
                }
                formData.append(`plantillas[${i}][imageAreas][${j}][imageFooter]`, ia.imageFooter);
            });
        }
    });

    return formData;
};

/**
 * Filters and formats city options for the AsyncSelect.
 */
export const filterCityOptions = (cities: City[], inputValue: string) => {
    if (!inputValue || inputValue.length < 2) return [];

    return cities
        .filter(c => c.city.toLowerCase().includes(inputValue.toLowerCase()))
        .slice(0, 10)
        .map(c => ({
            value: c.id,
            label: `${c.city}, ${c.country}`
        }));
};

/**
 * Styles for the react-select/async component.
 */
export const customSelectStyles = {
    control: (base: any, state: any) => ({
        ...base,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderColor: state.isFocused ? 'rgba(255, 237, 0, 0.5)' : 'rgba(30, 41, 59, 1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '7px',
        minHeight: '45px',
        boxShadow: state.isFocused ? '0 0 10px rgba(255, 237, 0, 0.1)' : 'none',
        '&:hover': {
            borderColor: 'rgba(30, 41, 59, 0.3)',
        }
    }),
    singleValue: (base: any) => ({
        ...base,
        color: 'white',
        fontSize: '14px'
    }),
    input: (base: any) => ({
        ...base,
        color: 'white'
    }),
    placeholder: (base: any) => ({
        ...base,
        color: 'rgba(255, 255, 255, 0.3)',
        fontSize: '14px'
    }),
    menu: (base: any) => ({
        ...base,
        backgroundColor: '#0a0a0a',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '7px',
        zIndex: 100
    }),
    option: (base: any, state: any) => ({
        ...base,
        backgroundColor: state.isFocused ? 'rgba(255, 237, 0, 0.1)' : 'transparent',
        color: state.isFocused ? '#ffed00' : 'white',
        cursor: 'pointer',
        '&:active': {
            backgroundColor: 'rgba(255, 237, 0, 0.2)',
        }
    })
};
