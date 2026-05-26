import { z } from "zod";

const username = z
  .string()
  .min(1, "Username is required")
  .trim()
  .min(3, "Username must be at least 3 characters")
  .max(32, "Username must be at most 32 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers, and underscores",
  );

const password = z
  .string()
  .min(1, "Password is required")
  .min(6, "Password must be at least 6 characters")
  .max(72, "Password must be at most 72 characters");

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required").trim(),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({ username, password });

export const createUserSchema = z.object({
  username,
  password,
  role: z.enum(["USER", "ADMIN"]),
});

export const editUserSchema = z.object({
  username,
  password: password.or(z.literal("")).optional(),
  role: z.enum(["USER", "ADMIN"]),
});

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
});

export const bookSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .trim()
    .max(200, "Title is too long"),
  author: z
    .string()
    .min(1, "Author is required")
    .trim()
    .max(100, "Author is too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .trim()
    .max(2000, "Description is too long"),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a number" })
    .min(1, "Price must be at least 1"),
  stock: z.coerce
    .number({ invalid_type_error: "Stock must be a number" })
    .min(0, "Stock cannot be negative"),
  categoryId: z.string().min(1, "Category is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type EditUserInput = z.infer<typeof editUserSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type BookInput = z.infer<typeof bookSchema>;
