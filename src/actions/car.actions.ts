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
  rawFilters?: Record<string, any>
): Promise<{
  success: boolean;
  data: any[];
  error?: string;
}> => {
  try {
    console.log("Raw filters received:", rawFilters);

    if (!rawFilters || Object.keys(rawFilters).length === 0) {
      const list_cars = await prisma.carForRent.findMany({
        orderBy: { createdAt: "desc" },
      });
      return { success: true, data: list_cars };
    }

    const where: any = {};

    // Handle price filters
    if (rawFilters.minPrice) {
      const minPrice = parseInt(rawFilters.minPrice, 10);
      if (!isNaN(minPrice)) {
        where.price = { ...where.price, gte: minPrice };
      }
    }

    if (rawFilters.maxPrice) {
      const maxPrice = parseInt(rawFilters.maxPrice, 10);
      if (!isNaN(maxPrice)) {
        where.price = { ...where.price, lte: maxPrice };
      }
    }

    // Car type filters - map to your enum values
    const carTypeFilters: string[] = [];

    // Based on your Prisma schema, these should match your CarType enum
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
      if (rawFilters[filterKey] === "true") {
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
      if (rawFilters[fuelType] === "true") {
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
      if (rawFilters[transmission] === "true") {
        transmissionFilters.push(transmission);
      }
    });

    if (transmissionFilters.length > 0) {
      where.transmission =
        transmissionFilters.length === 1
          ? transmissionFilters[0]
          : { in: transmissionFilters };
    }

    console.log("Final where clause:", JSON.stringify(where, null, 2));

    const cars = await prisma.carForRent.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: cars };
  } catch (error) {
    console.error("Error filtering cars:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch cars",
      data: [],
    };
  }
};

// Alternative version with better type safety using Prisma types
export const filter_cars_with_types = async (
  rawFilters?: Record<string, any>
): Promise<{
  success: boolean;
  data: any[];
  error?: string;
}> => {
  try {
    console.log("Raw filters received:", rawFilters);

    if (!rawFilters || Object.keys(rawFilters).length === 0) {
      const list_cars = await prisma.carForRent.findMany({
        orderBy: { createdAt: "desc" },
      });
      return { success: true, data: list_cars };
    }

    // Build where clause with proper Prisma types
    const where: {
      price?: { gte?: number; lte?: number };
      type?: string | { in: string[] };
      fuelType?: string | { in: string[] };
      transmission?: string | { in: string[] };
    } = {};

    // Price filters
    if (rawFilters.minPrice) {
      const minPrice = parseInt(rawFilters.minPrice, 10);
      if (!isNaN(minPrice)) {
        where.price = { ...where.price, gte: minPrice };
      }
    }

    if (rawFilters.maxPrice) {
      const maxPrice = parseInt(rawFilters.maxPrice, 10);
      if (!isNaN(maxPrice)) {
        where.price = { ...where.price, lte: maxPrice };
      }
    }

    // Define all possible filter mappings
    const filterConfig = {
      type: {
        // Map frontend filter names to database enum values
        sedan: "SEDAN",
        suv: "SUV",
        truck: "TRUCK",
        coupe: "COUPE",
        convertible: "CONVERTIBLE",
        hatchback: "HATCHBACK",
        minivan: "MINIVAN",
        wagon: "WAGON",
      },
      fuelType: {
        // These might match your database values directly
        petrol: "petrol",
        diesel: "diesel",
        electric: "electric",
        hybrid: "hybrid",
        lpg: "lpg",
      },
      transmission: {
        // These might match your database values directly
        automatic: "automatic",
        manual: "manual",
        cvt: "cvt",
      },
    };

    // Process each filter category
    Object.entries(filterConfig).forEach(([dbField, mapping]) => {
      const selectedValues: string[] = [];

      Object.entries(mapping).forEach(([filterKey, dbValue]) => {
        if (rawFilters[filterKey] === "true") {
          selectedValues.push(dbValue);
        }
      });

      if (selectedValues.length > 0) {
        (where as any)[dbField] =
          selectedValues.length === 1
            ? selectedValues[0]
            : { in: selectedValues };
      }
    });

    console.log("Final where clause:", JSON.stringify(where, null, 2));

    const cars = await prisma.carForRent.findMany({
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: cars };
  } catch (error) {
    console.error("Error filtering cars:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch cars",
      data: [],
    };
  }
};
