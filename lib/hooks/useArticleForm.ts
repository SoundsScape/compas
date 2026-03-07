import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCities } from "./useCities";
import { useTags, OptionType } from "./useTags";
import { createArticle } from "../services/articleService";
import { User } from "../interfaces/user.interface";
import { Plantilla, ArticleFormData } from "../interfaces/article.interface";
import {
    validateArticleForm,
    prepareArticleFormData,
    filterCityOptions
} from "../utils/articleUtils";

export function useArticleForm() {
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
    const getFormData = (): ArticleFormData => ({
        titulo,
        nombre_autor,
        apellidos_autor,
        centro,
        bibliografia,
        fecha,
        location,
        selectedTags,
        plantillaData
    });

    const isFormValid = validateArticleForm(getFormData());

    // Load user data and draft from localStorage
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const user: User = JSON.parse(userData);
            setNombre(user.first_name || "");
            setApellidos(user.last_name || "");
            setCentro(user.school?.name || "");
            setUserRole(user.role?.role_name || "user");
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
    }, [currentYear]);

    // Save draft to localStorage
    useEffect(() => {
        const draft = getFormData();
        localStorage.setItem('article_form_draft', JSON.stringify(draft));
    }, [titulo, fecha, location, plantillaData, bibliografia, selectedTags, centro]);

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
                        setIsSubmitting(false);
                        return;
                    }
                }
            }

            const formData = prepareArticleFormData(getFormData(), cities);
            await createArticle(formData);
            localStorage.removeItem('article_form_draft');
            router.push('/articles');
        } catch (error) {
            console.error("Error creating article:", error);
            alert("Error al crear el artículo. Por favor, intenta de nuevo.");
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
