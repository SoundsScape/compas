import { z } from "zod";

export const createCitySchema = z.object({
    city: z.string().min(1, "El nombre de la ciudad es obligatorio"),
    city_ascii: z.string().min(1, "El nombre ASCII es obligatorio"),
    lat: z.number({ message: "La latitud es obligatoria y debe ser un número" }),
    lng: z.number({ message: "La longitud es obligatoria y debe ser un número" }),
    country: z.string().min(1, "El país es obligatorio"),
    iso2: z.string().length(2, "El código ISO2 debe tener 2 caracteres"),
    iso3: z.string().length(3, "El código ISO3 debe tener 3 caracteres"),
    admin_name: z.string().optional().nullable(),
    capital: z.string().optional().nullable(),
    population: z.number().int().optional().nullable(),
});

export const updateCitySchema = createCitySchema.partial();

export type CreateCityInput = z.infer<typeof createCitySchema>;
export type UpdateCityInput = z.infer<typeof updateCitySchema>;
