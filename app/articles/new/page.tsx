"use client";

import ProtectedRoute from "@/components/shared/auth/ProtectedRoute";
import { ArticleHeader } from "@/components/features/articles/form/ArticleHeader";
import { ArticleMetadataForm } from "@/components/features/articles/form/ArticleMetadataForm";
import { ArticleSidebar } from "@/components/features/articles/form/ArticleSidebar";
import { ArticleContentEditor } from "@/components/features/articles/form/ArticleContentEditor";
import { ArticleBibliography } from "@/components/features/articles/form/ArticleBibliography";
import ArticleFooter from "@/components/features/articles/form/ArticleFooter";
import { useArticleForm } from "@/lib/hooks/useArticleForm";
import { customSelectStyles } from "@/lib/utils/articleUtils";
import TagsWrapper from "@/components/features/articles/tags/TagsWrapper";

export default function NewArticlePage() {
    const {
        titulo, setTitulo,
        nombre_autor, apellidos_autor,
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

        loadCityOptions,
        addPlantilla,
        removePlantilla,
        movePlantilla,
        handleTagChange,
        removeTag,
        handleSubmit
    } = useArticleForm();

    return (
        <ProtectedRoute>
            <main className="min-h-screen selection:bg-accent/30 max-w-5xl mx-auto pt-32 pb-20 px-6">
                <ArticleHeader
                    isSubmitting={isSubmitting}
                    isValid={isFormValid}
                    onSubmit={handleSubmit}
                />

                <div className="space-y-6">
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <ArticleMetadataForm
                            titulo={titulo}
                            setTitulo={setTitulo}
                            location={location}
                            setLocation={setLocation}
                            fecha={fecha}
                            setFecha={setFecha}
                            loadCityOptions={loadCityOptions}
                            currentYear={currentYear}
                            customSelectStyles={customSelectStyles}
                        />

                        <ArticleSidebar
                            nombre_autor={nombre_autor}
                            apellidos_autor={apellidos_autor}
                            centro={centro}
                            setCentro={setCentro}
                            userRole={userRole}
                            tagOptions={tagOptions}
                            selectedTags={selectedTags}
                            handleTagChange={handleTagChange}
                            removeTag={removeTag}
                        />
                    </section>

                    <TagsWrapper
                        tagOptions={tagOptions}
                        selectedTags={selectedTags}
                        handleTagChange={handleTagChange}
                        removeTag={removeTag}
                    />

                    <ArticleContentEditor
                        plantillaData={plantillaData}
                        addPlantilla={addPlantilla}
                        removePlantilla={removePlantilla}
                        movePlantilla={movePlantilla}
                        setPlantillaData={setPlantillaData}
                    />

                    <ArticleBibliography
                        bibliografia={bibliografia}
                        setBibliografia={setBibliografia}
                    />

                    <ArticleFooter
                        isSubmitting={isSubmitting}
                        isValid={isFormValid}
                        onSubmit={handleSubmit}
                    />
                </div>
            </main>
        </ProtectedRoute>
    );
}
