"use server";

import { prisma } from "@/lib/prisma";
import { get_current_user } from "./user.actions";

export const get_user_booking = async () => {
  try {
    const user = await get_current_user();

    if (!user) {
      return { success: false, message: "User not found" };
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: user.id },
      include: { car: true },
      orderBy: { startDate: "desc" },
    });
    return {  bookings };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error fetching bookings" };
  }
};
