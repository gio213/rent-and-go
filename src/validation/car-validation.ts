import { z } from "zod";

// Schema for frontend form submission (with File objects)
export const CarFormValidationSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  year: z
    .string()
    .min(4, "Year must be 4 digits")
    .max(4, "Year must be 4 digits"),
  description: z.string().min(1, "Description is required"),
  pricePerDay: z.number().min(0, "Price per day must be a positive number"),
  images: z
    .array(z.instanceof(File))
    .min(1, "At least one image is required")
    .refine(
      (files) => files.every((file) => file.type.startsWith("image/")),
      "All files must be images"
    )
    .refine(
      (files) => files.every((file) => file.size <= 5 * 1024 * 1024),
      "Each image must be less than 5MB"
    ),

  transmission: z.string().min(1, "Transmission type is required"),
  fuelType: z.string().min(1, "Fuel type is required"),
  seats: z
    .number()
    .min(1, "At least one seat is required")
    .max(8, "Maximum 8 seats allowed"),
  doors: z
    .number()
    .min(1, "At least one door is required")
    .max(5, "Maximum 5 doors allowed"),
  type: z.enum([
    "SEDAN",
    "SUV",
    "TRUCK",
    "COUPE",
    "CONVERTIBLE",
    "HATCHBACK",
    "MINIVAN",
    "WAGON",
  ]),
});

// Schema for database operations (with URL strings)
export const CarValidationSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  year: z
    .string()
    .min(4, "Year must be 4 digits")
    .max(4, "Year must be 4 digits"),
  description: z.string().min(1, "Description is required"),
  pricePerDay: z.number().min(0, "Price per day must be a positive number"),
  imageUrl: z.array(z.url()).min(1, "At least one image URL is required"),
  transmission: z.string().min(1, "Transmission type is required"),
  fuelType: z.string().min(1, "Fuel type is required"),
  seats: z
    .number()
    .min(1, "At least one seat is required")
    .max(8, "Maximum 8 seats allowed"),
  doors: z
    .number()
    .min(1, "At least one door is required")
    .max(5, "Maximum 5 doors allowed"),
  type: z.enum([
    "SEDAN",
    "SUV",
    "TRUCK",
    "COUPE",
    "CONVERTIBLE",
    "HATCHBACK",
    "MINIVAN",
    "WAGON",
  ]),
});

export type CarFormData = z.infer<typeof CarFormValidationSchema>;
export type CarValidationSchemaType = z.infer<typeof CarValidationSchema>;

// Helper function to transform form data to DB format
export const transformCarFormToDb = (
  formData: CarFormData,
  uploadedUrls: string[]
): CarValidationSchemaType => {
  return {
    brand: formData.brand,
    model: formData.model,
    year: formData.year,
    description: formData.description,
    pricePerDay: formData.pricePerDay,
    imageUrl: uploadedUrls,
    doors: formData.doors,
    seats: formData.seats,
    fuelType: formData.fuelType,
    transmission: formData.transmission,
    type: formData.type,
  };
};
