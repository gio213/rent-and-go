"use server";

import {
  CarFormData,
  CarFormValidationSchema,
  transformCarFormToDb,
} from "@/validation/car-validation";
import { get_current_user } from "./user.actions";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";

const carTypeMap: Record<string, string> = {
  SEDAN: "SEDAN",
  SUV: "SUV",
  TRUCK: "TRUCK",
  COUPE: "COUPE",
  CONVERTIBLE: "CONVERTIBLE",
  HATCHBACK: "HATCHBACK",
  MINIVAN: "MINIVAN",
  WAGON: "WAGON",
};

export const add_car = async (carData: CarFormData) => {
  // 1. Validate the form data
  const parsedData = CarFormValidationSchema.safeParse(carData);

  if (!parsedData.success) {
    throw new Error("Validation failed: " + parsedData.error.message);
  }
  const validatedData = parsedData.data;

  // 2. Check authorization
  const currentAdmin = await get_current_user();
  if (currentAdmin?.role !== "ADMIN") {
    throw new Error("Unauthorized: Only admins can add cars");
  }

  try {
    // 3. Upload all images to Vercel Blob and get URLs
    const uploadPromises = validatedData.images.map(async (file) => {
      const blob = await put(`${"rent-and-go"}/${file.name}`, file, {
        access: "public",
        addRandomSuffix: true,
      });
      return blob.url;
    });

    const uploadedUrls = await Promise.all(uploadPromises);

    // 4. Transform form data to database format
    const dbData = transformCarFormToDb(validatedData, uploadedUrls);

    // 5. Save to database
    const newCar = await prisma.carForRent.create({
      data: {
        brand: dbData.brand,
        model: dbData.model,
        year: parseInt(dbData.year), // Convert string to number for DB
        description: dbData.description,
        price: dbData.pricePerDay, // Map pricePerDay to price field
        image: dbData.imageUrl, // Array of URLs
        doors: dbData.doors,
        seats: dbData.seats,
        fuelType: dbData.fuelType,
        transmission: dbData.transmission,
        type: dbData.type,
      },
    });

    return {
      success: true,
      message: "Car added successfully",
      carId: newCar.id,
    };
  } catch (error) {
    console.error("Error adding car:", error);
    throw new Error("Failed to add car. Please try again.");
  }
};

export const list_cars = async () => {
  try {
    const cars = await prisma.carForRent.findMany({
      select: {
        id: true,
        brand: true,
        model: true,
        year: true,
        price: true,
        image: true,
        bookings: true, // Assuming you want to include bookings
        description: true,
        _count: {
          select: {
            bookings: true, // Assuming you want to count bookings
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Order by creation date
      },
    });

    if (cars.length === 0) {
      console.warn("No cars found");
    }

    return cars;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to list cars");
  }
};

export const car_details = async (carId: string) => {
  try {
    if (!carId) {
      throw new Error("Car ID is required");
    }
    const car = await prisma.carForRent.findUnique({
      where: { id: carId },
      select: {
        bookings: true,
        id: true,
        brand: true,
        model: true,
        year: true,
        price: true,
        image: true,
        description: true,
        doors: true,
        seats: true,
        fuelType: true,
        transmission: true,
        type: true,
      },
    });

    return car;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to retrieve car details");
  }
};

export const search_car = async (query: string) => {
  try {
    if (!query) {
      throw new Error("Search query is required");
    }
    const q = query.trim();

    // Map free-text to CarType enum values (case-insensitive, ignores spaces/dashes)
    const normalize = (s: string) => s.replace(/[\s_-]/g, "").toUpperCase();
    const tokens = q.split(/\s+/).map(normalize);

    const normalizedToCanonical = Object.fromEntries(
      Object.keys(carTypeMap).map((k) => [normalize(k), carTypeMap[k]])
    ) as Record<string, string>;

    const matchedTypes = new Set<string>();
    for (const t of tokens) {
      const match = normalizedToCanonical[t];
      if (match) matchedTypes.add(match);
    }

    const orConditions: any[] = [
      { brand: { contains: q, mode: "insensitive" } },
      { model: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { fuelType: { contains: q, mode: "insensitive" } },
      { transmission: { contains: q, mode: "insensitive" } },
    ];

    if (matchedTypes.size > 0) {
      orConditions.push({ type: { in: Array.from(matchedTypes) as any } });
    }

    const cars = await prisma.carForRent.findMany({
      where: { OR: orConditions },
    });
    return cars;
  } catch (error) {
    console.error(error);
    throw new Error("Search failed");
  }
};

export const filter_cars_typed = async (
  params: { page?: number; limit?: number } & Record<string, any>
): Promise<{
  success: boolean;
  data: any[];
  error?: string;
  page?: number;
  limit?: number;
  total?: number;
  hasMore?: boolean;
  predictNextCount?: number;
}> => {
  const { page: pageParam, limit: limitParam, ...filters } = params;
  const page = Math.max(1, pageParam ?? 1);
  const limit = Math.min(50, Math.max(1, limitParam ?? 4));

  try {
    const where: any = {};
    const hasFilters = filters && Object.keys(filters).length > 0;

    if (hasFilters) {
      // Handle price filters
      if (filters.minPrice) {
        const minPrice = parseInt(filters.minPrice, 10);
        if (!isNaN(minPrice)) {
          where.price = { ...where.price, gte: minPrice };
        }
      }

      if (filters.maxPrice) {
        const maxPrice = parseInt(filters.maxPrice, 10);
        if (!isNaN(maxPrice)) {
          where.price = { ...where.price, lte: maxPrice };
        }
      }

      // Car type filters - map to your enum values
      const carTypeFilters: string[] = [];
      const carTypeMapping: Record<string, string> = {
        sedan: "SEDAN",
        suv: "SUV",
        truck: "TRUCK",
        coupe: "COUPE",
        convertible: "CONVERTIBLE",
        hatchback: "HATCHBACK",
        minivan: "MINIVAN",
        wagon: "WAGON",
      };

      Object.entries(carTypeMapping).forEach(([filterKey, enumValue]) => {
        if (filters[filterKey] === "true") {
          carTypeFilters.push(enumValue);
        }
      });

      if (carTypeFilters.length > 0) {
        where.type =
          carTypeFilters.length === 1
            ? carTypeFilters[0]
            : { in: carTypeFilters };
      }

      // Fuel type filters
      const fuelTypeFilters: string[] = [];
      const fuelTypes = ["petrol", "diesel", "electric", "hybrid", "lpg"];

      fuelTypes.forEach((fuelType) => {
        if (filters[fuelType] === "true") {
          fuelTypeFilters.push(fuelType);
        }
      });

      if (fuelTypeFilters.length > 0) {
        where.fuelType =
          fuelTypeFilters.length === 1
            ? fuelTypeFilters[0]
            : { in: fuelTypeFilters };
      }

      // Transmission filters
      const transmissionFilters: string[] = [];
      const transmissions = ["automatic", "manual", "cvt"];

      transmissions.forEach((transmission) => {
        if (filters[transmission] === "true") {
          transmissionFilters.push(transmission);
        }
      });

      if (transmissionFilters.length > 0) {
        where.transmission =
          transmissionFilters.length === 1
            ? transmissionFilters[0]
            : { in: transmissionFilters };
      }
    }

    // Execute queries in parallel for better performance
    const [total, items] = await Promise.all([
      prisma.carForRent.count({ where }),
      prisma.carForRent.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: 8,
      }),
    ]);

    // Calculate if there are more items to load
    const hasMore = page * limit < total;

    return {
      success: true,
      data: items,
      page,
      limit,
      total,
      hasMore,
    };
  } catch (error) {
    console.error("Error filtering cars:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch cars",
      data: [],
    };
  }
};
