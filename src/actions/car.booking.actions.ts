"use server";

import { prisma } from "@/lib/prisma";
import {
  BookCarFormData,
  BookCarValidationSchemaDetailed,
} from "@/validation/book-car-validation";

export const book_car = async (bookingData: BookCarFormData) => {
  const parsedData = BookCarValidationSchemaDetailed.safeParse(bookingData);
  if (!parsedData.success) {
    throw new Error("Invalid booking data");
  }

  try {
    await prisma.booking.create({
      data: {
        ...parsedData.data,
      },
    });
    return {
      success: true,
      message: "Car booked successfully",
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to book car. Please try again.");
  }
};
