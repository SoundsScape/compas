import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCities } from "./useCities";
import { useTags, OptionType } from "./useTags";
import { createArticle, getArticleById, updateArticle } from "../services/articleService";
import { User } from "../interfaces/user.interface";
import { Plantilla, ArticleFormData, Article } from "../interfaces/article.interface";
import {
    validateArticleForm,
    prepareArticleFormData,
    filterCityOptions
} from "../utils/articleUtils";

export function useArticleForm(articleId?: number) {
    const router = useRouter();
    const { cities } = useCities();
    const { options: tagOptions } = useTags();

    // Form State
    const [titulo, setTitulo] = useState("");
    const [nombre_autor, setNombre] = useState("");
    const [apellidos_autor, setApellidos] = useState("");
    const [centro, setCentro] = useState("");
    const [bibliografia, setBibliografia] = useState("");
    const [fecha, setFecha] = useState<number>(new Date().getFullYear());
    const [location, setLocation] = useState<OptionType | null>(null);
    const [selectedTags, setSelectedTags] = useState<OptionType[]>([]);
    const [plantillaData, setPlantillaData] = useState<Plantilla[]>([]);

    // UI State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userRole, setUserRole] = useState<string>("user");
    const currentYear = new Date().getFullYear();

    // Helper for easier data access
    const getFormData = useCallback((): ArticleFormData => ({
        titulo,
        nombre_autor,
        apellidos_autor,
        centro,
        bibliografia,
        fecha,
        location,
        selectedTags,
        plantillaData
    }), [titulo, nombre_autor, apellidos_autor, centro, bibliografia, fecha, location, selectedTags, plantillaData]);

    const isFormValid = validateArticleForm(getFormData());

    // Load article data if editing
    useEffect(() => {
        if (!articleId || cities.length === 0) return;

        const loadArticle = async () => {
            try {
                const article: Article = await getArticleById(articleId);
                setTitulo(article.titulo);
                setNombre(article.nombre_autor);
                setApellidos(article.apellidos_autor);
                setCentro(article.centro);
                setBibliografia(article.bibliografia);
                setFecha(article.fecha);

                // Map location
                const city = cities.find(c => c.lat === article.latitud && c.lng === article.longitud);
                if (city) {
                    setLocation({ value: city.id, label: `${city.city}, ${city.country}` });
                }

                // Map tags
                if (article.tags) {
                    setSelectedTags(article.tags.map(t => ({ value: t.id.toString(), label: t.name })));
                }

                // Map templates
                if (article.templates) {
                    const mappedPlantillas: Plantilla[] = article.templates
                        .sort((a, b) => a.order - b.order)
                        .map(t => ({
                            id: t.id,
                            tipo: t.type as "plantilla1" | "plantilla2",
                            shortCitation: t.shortCitation,
                            textAreas: t.text_areas.sort((a, b) => a.order - b.order).map(ta => ({ value: ta.content })),
                            imageAreas: t.image_areas.sort((a, b) => a.order - b.order).map(ia => ({
                                imageFile: ia.imagePath,
                                imageFooter: ia.imageFooter
                            }))
                        }));
                    setPlantillaData(mappedPlantillas);
                }
            } catch (error) {
                console.error("Error loading article for edit:", error);
            }
        };

        loadArticle();
    }, [articleId, cities]);

    // Load user data and draft from localStorage
    useEffect(() => {
        // If editing, we don't load draft/user data over the fetched article
        if (articleId) return;

        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const user: any = JSON.parse(userData);
                setNombre(user.first_name || "");
                setApellidos(user.last_name || "");
                setCentro(user.school?.name || "");

                const r_name = (
                    user.role ||
                    user.role_name ||
                    user.roles?.role_name ||
                    (user.username === 'admin' ? 'admin' : "")
                ).toLowerCase();

                if (r_name === 'student') {
                    setUserRole("student");
                } else if (r_name === 'teacher') {
                    setUserRole("teacher");
                } else if (r_name === 'admin' || r_name === 'superadmin') {
                    setUserRole("admin");
                } else {
                    const r_id = Number(user.roles_id);
                    if (r_id === 3) setUserRole("student");
                    else if (r_id === 4) setUserRole("teacher");
                    else if (r_id === 1 || r_id === 2) setUserRole("admin");
                    else setUserRole(r_name || "user");
                }
            } catch (e) {
                console.error("Error parsing user data in hook", e);
            }
        }

        const draft = localStorage.getItem('article_form_draft');
        if (draft) {
            try {
                const parsedDraft = JSON.parse(draft);
                setTitulo(parsedDraft.titulo || "");
                setFecha(parsedDraft.fecha || currentYear);
                setLocation(parsedDraft.location || null);
                setPlantillaData(parsedDraft.plantillaData || []);
                setBibliografia(parsedDraft.bibliografia || "");
                setSelectedTags(parsedDraft.selectedTags || []);
                if (parsedDraft.centro) setCentro(parsedDraft.centro);
            } catch (e) {
                console.error("Error loading draft", e);
            }
        }
    }, [currentYear, articleId]);

    // Save draft to localStorage (only if not editing)
    useEffect(() => {
        if (articleId) return;
        const draft = getFormData();
        localStorage.setItem('article_form_draft', JSON.stringify(draft));
    }, [titulo, fecha, location, plantillaData, bibliografia, selectedTags, centro, articleId, getFormData]);

    // Handlers
    const loadCityOptions = (inputValue: string, callback: (options: OptionType[]) => void) => {
        callback(filterCityOptions(cities, inputValue));
    };

    const addPlantilla = (tipo: "plantilla1" | "plantilla2") => {
        const newPlantilla: Plantilla = {
            id: Date.now(),
            tipo,
            textAreas: [{ value: "" }],
            imageAreas: tipo === "plantilla1" ? [{ imageFile: null, imageFooter: "" }] : [],
            shortCitation: ""
        };
        setPlantillaData([...plantillaData, newPlantilla]);
    };

    const removePlantilla = (id: number) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este bloque?")) {
            setPlantillaData(plantillaData.filter(p => p.id !== id));
        }
    };

    const movePlantilla = (idx: number, direction: "up" | "down") => {
        const newArr = [...plantillaData];
        const targetIdx = direction === "up" ? idx - 1 : idx + 1;
        if (targetIdx < 0 || targetIdx >= newArr.length) return;

        [newArr[idx], newArr[targetIdx]] = [newArr[targetIdx], newArr[idx]];
        setPlantillaData(newArr);
    };

    const handleTagChange = (tag: OptionType | null) => {
        if (tag && !selectedTags.find(t => t.value === tag.value)) {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const removeTag = (value: string) => {
        setSelectedTags(selectedTags.filter(t => t.value !== value));
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!isFormValid) return;

        setIsSubmitting(true);
        try {
            const MAX_SIZE = 4 * 1024 * 1024; // 4MB
            for (const p of plantillaData) {
                for (const i of p.imageAreas) {
                    if (i.imageFile instanceof File && i.imageFile.size > MAX_SIZE) {
                        alert("Una de las imágenes supera el tamaño máximo de 4MB.");
                        setIsSubmitting(false);
                        return;
                    }
                }
            }

            const formData = prepareArticleFormData(getFormData(), cities);

            if (articleId) {
                await updateArticle(articleId, formData);
            } else {
                await createArticle(formData);
                localStorage.removeItem('article_form_draft');
            }

            router.push('/dashboard/my-articles');
        } catch (error) {
            console.error("Error submitting article:", error);
            alert("Error al procesar el artículo. Por favor, intenta de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        // State
        titulo, setTitulo,
        nombre_autor,
        apellidos_autor,
        centro, setCentro,
        bibliografia, setBibliografia,
        fecha, setFecha,
        location, setLocation,
        selectedTags,
        plantillaData, setPlantillaData,
        isSubmitting,
        userRole,
        currentYear,
        tagOptions,
        isFormValid,

        // Handlers
        loadCityOptions,
        addPlantilla,
        removePlantilla,
        movePlantilla,
        handleTagChange,
        removeTag,
        handleSubmit
    };
}
