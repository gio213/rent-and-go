"use server";

import {
  CarFormData,
  CarFormValidationSchema,
  transformCarFormToDb,
} from "@/validation/car-validation";
import { get_current_user } from "./user.actions";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";

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
      const blob = await put(file.name, file, {
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
