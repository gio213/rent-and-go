import { z } from "zod";

// Alternative approach with more detailed validation
export const BookCarValidationSchemaDetailed = z
  .object({
    carId: z.string().min(1, "Car ID is required"),
    carImage: z.url().optional(),
    pricePerDay: z.number().min(0, "Price per day must be a positive number"),
    carName: z.string().min(1, "Car name is required"),
    carModel: z.string().min(1, "Car model is required"),
    startDate: z
      .date()
      .refine(
        (date) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const compareDate = new Date(date);
          compareDate.setHours(0, 0, 0, 0);

          return compareDate >= today;
        },
        {
          message: "Start date cannot be in the past",
        }
      )
      .refine(
        (date) => {
          // Optional: Limit booking to within next 365 days
          const maxDate = new Date();
          maxDate.setDate(maxDate.getDate() + 365);
          return date <= maxDate;
        },
        {
          message: "Start date cannot be more than 1 year in advance",
        }
      ),

    endDate: z.date(),
  })
  .refine(
    (data) => {
      return data.endDate > data.startDate;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => {
      // Optional: Maximum rental period (e.g., 30 days)
      const diffTime = Math.abs(
        data.endDate.getTime() - data.startDate.getTime()
      );
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30;
    },
    {
      message: "Rental period cannot exceed 30 days",
      path: ["endDate"],
    }
  );

// Type definitions
export type BookCarFormData = z.infer<typeof BookCarValidationSchemaDetailed>;
export type BookCarFormDataDetailedType = z.infer<
  typeof BookCarValidationSchemaDetailed
>;
