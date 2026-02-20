import { prisma } from "@/lib/prisma/client";

export interface CreateCityDTO {
    city: string;
    city_ascii: string;
    lat: number;
    lng: number;
    country: string;
    iso2: string;
    iso3: string;
    admin_name?: string;
    capital?: string;
    population?: number;
}

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

    static async createCity(data: CreateCityDTO) {
        try {
            this.validateCityData(data);

            return await prisma.cities.create({
                data: {
                    city: data.city,
                    city_ascii: data.city_ascii,
                    lat: data.lat,
                    lng: data.lng,
                    country: data.country,
                    iso2: data.iso2,
                    iso3: data.iso3,
                    admin_name: data.admin_name || null,
                    capital: data.capital || null,
                    population: data.population || null
                }
            });
        } catch (error: any) {
            if (error.status) throw error;
            console.error("CitiesService.createCity Error:", error);
            throw { status: 500, message: "Error al crear la ciudad." };
        }
    }

    static async updateCity(id: number | bigint, data: Partial<CreateCityDTO>) {
        try {
            this.validateCityData(data, true);

            // Construir objeto de actualización omitiendo undefined
            const updateData: any = {};
            const fields: (keyof CreateCityDTO)[] = [
                'city', 'city_ascii', 'lat', 'lng', 'country',
                'iso2', 'iso3', 'admin_name', 'capital', 'population'
            ];

            for (const field of fields) {
                if (data[field] !== undefined) {
                    updateData[field] = data[field];
                }
            }

            return await prisma.cities.update({
                where: { id: BigInt(id) },
                data: updateData
            });
        } catch (error: any) {
            if (error.status) throw error;
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

    /**
     * Valida los datos de entrada para una ciudad.
     */
    private static validateCityData(data: Partial<CreateCityDTO>, isUpdate: boolean = false) {
        if (!isUpdate) {
            const required: (keyof CreateCityDTO)[] = ['city', 'city_ascii', 'lat', 'lng', 'country', 'iso2', 'iso3'];
            for (const field of required) {
                if (data[field] === undefined || data[field] === null || (typeof data[field] === 'string' && data[field].trim() === '')) {
                    throw { status: 400, message: `El campo '${field}' es obligatorio para crear una ciudad.` };
                }
            }
        }

        // Validaciones de tipo y formato (si están presentes)
        if (data.lat !== undefined && (typeof data.lat !== 'number' || isNaN(data.lat))) {
            throw { status: 400, message: "La latitud debe ser un número válido." };
        }
        if (data.lng !== undefined && (typeof data.lng !== 'number' || isNaN(data.lng))) {
            throw { status: 400, message: "La longitud debe ser un número válido." };
        }
        if (data.iso2 !== undefined && (typeof data.iso2 !== 'string' || data.iso2.length !== 2)) {
            throw { status: 400, message: "El código ISO2 debe tener exactamente 2 caracteres." };
        }
        if (data.iso3 !== undefined && (typeof data.iso3 !== 'string' || data.iso3.length !== 3)) {
            throw { status: 400, message: "El código ISO3 debe tener exactamente 3 caracteres." };
        }
    }
}
