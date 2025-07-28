"use server";

import { signToken, verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import {
  LoginSchema,
  LoginSchemaType,
  UserRegisterSchema,
  UserRegisterSchemaType,
} from "@/validation/auth-validation";
import { cookies } from "next/headers";
import { compare, hash } from "bcryptjs";

export const register_user = async (formData: UserRegisterSchemaType) => {
  const parsedData = UserRegisterSchema.safeParse(formData);
  if (!parsedData.success) {
    throw new Error("Please check your input");
  }

  const { email, lastName, name, password } = parsedData.data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log("User already exists with this email:", email);
    throw new Error("User already exists with this email");
  }

  try {
    const hashedPassword = await hash(password, 10);
    await prisma.user.create({
      data: {
        email,
        lastName,
        name,
        password: hashedPassword,
      },
    });

    return { success: true, message: "User registered successfully" };
  } catch (error) {
    console.error("Registration error:", error);
    throw new Error("Failed to register user. Please try again.");
  }
};
export const login_user = async (formData: LoginSchemaType) => {
  try {
    const parsedData = LoginSchema.safeParse(formData);
    if (!parsedData.success) {
      return {
        error: "Invalid input data",
        issues: parsedData.error.issues,
        message: "Please check your input",
      };
    }
    const { email, password } = parsedData.data;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    // create token
    const token = await signToken({
      email: user.email,
      userId: user.id,
      role: user.role,
      name: user.name,
    });
    // set token in cookies

    const cookieStore = await cookies();
    cookieStore.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 დღე (to match JWT expiry)
    });

    return {
      success: true,
      user: user,
      message: "User logged in successfully",
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to log in user. Please check your credentials.");
  }
};

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
        id: true,
        email: true,
        name: true,
        lastName: true,
        role: true, // Include role in the selection
        createdAt: true,
        updatedAt: true,
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
