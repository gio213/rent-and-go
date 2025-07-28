import { email, z } from "zod";

export const LoginSchema = z.object({
  email: z.email().min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const UserRegisterSchema = z.object({
  email: z.email().min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  name: z.string().min(1, "Name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type UserRegisterSchemaType = z.infer<typeof UserRegisterSchema>;
