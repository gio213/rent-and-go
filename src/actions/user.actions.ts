"use server";

import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export const get_current_user = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return null; // No token found
    }
    // Verify and decode the token
    const decoded = await verifyToken(token);
    if (!decoded || !decoded.userId) {
      return null; // Invalid token
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        properties: true,
        id: true,
        email: true,
        CreditTransaction: true,
        credit: true,
        lastName: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    return {
      ...currentUser,
    };
  } catch (error) {
    console.error(error);
    return null; // Error occurred while fetching user
  }
};
