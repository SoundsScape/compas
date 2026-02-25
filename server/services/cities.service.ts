import { prisma } from "@/lib/prisma/client";
import { createCitySchema, updateCitySchema, CreateCityInput, UpdateCityInput } from "@/validations/city.schema";

export class CitiesService {
    static async getCities() {
        return await prisma.cities.findMany({
            orderBy: {
                city: "asc",
            },
        });
    }

    static async getCityById(id: number | bigint) {
        return await prisma.cities.findUnique({
            where: { id: BigInt(id) }
        });
    }

    static async createCity(data: CreateCityInput) {
        try {
            const validatedData = createCitySchema.parse(data);

            return await prisma.cities.create({
                data: {
                    city: validatedData.city,
                    city_ascii: validatedData.city_ascii,
                    lat: validatedData.lat,
                    lng: validatedData.lng,
                    country: validatedData.country,
                    iso2: validatedData.iso2,
                    iso3: validatedData.iso3,
                    admin_name: validatedData.admin_name || null,
                    capital: validatedData.capital || null,
                    population: validatedData.population || null
                }
            });
        } catch (error: any) {
            if (error.name === "ZodError") throw error;
            console.error("CitiesService.createCity Error:", error);
            throw { status: 500, message: "Error al crear la ciudad." };
        }
    }

    static async updateCity(id: number | bigint, data: UpdateCityInput) {
        try {
            const validatedData = updateCitySchema.parse(data);

            // Construir objeto de actualización omitiendo undefined
            const updateData: any = {};
            const fields: (keyof UpdateCityInput)[] = [
                'city', 'city_ascii', 'lat', 'lng', 'country',
                'iso2', 'iso3', 'admin_name', 'capital', 'population'
            ];

            for (const field of fields) {
                if (validatedData[field] !== undefined) {
                    updateData[field] = validatedData[field];
                }
            }

            return await prisma.cities.update({
                where: { id: BigInt(id) },
                data: updateData
            });
        } catch (error: any) {
            if (error.name === "ZodError") throw error;
            console.error("CitiesService.updateCity Error:", error);
            throw { status: 500, message: "Error al actualizar la ciudad." };
        }
    }

    static async deleteCity(id: number | bigint) {
        try {
            return await prisma.cities.delete({
                where: { id: BigInt(id) }
            });
        } catch (error: any) {
            console.error("CitiesService.deleteCity Error:", error);
            throw { status: 500, message: "Error al eliminar la ciudad." };
        }
    }
}
