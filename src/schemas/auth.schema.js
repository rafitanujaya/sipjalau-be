import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(3, "Nama minimal 3 karakter.")
      .max(150, "Nama maksimal 150 karakter."),

    username: z
      .string()
      .trim()
      .min(3, "Username minimal 3 karakter.")
      .max(50, "Username maksimal 50 karakter.")
      .regex(
        /^[a-zA-Z0-9._-]+$/,
        "Username hanya boleh mengandung huruf, angka, titik, underscore, atau dash.",
      )
      .transform((value) => value.toLowerCase()),

    password: z
      .string()
      .min(8, "Password minimal 8 karakter.")
      .max(72, "Password maksimal 72 karakter."),

    role: z.enum(["cashier", "manager"], {
      message: "Role harus berupa cashier atau manager.",
    }),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    username: z
      .string()
      .trim()
      .min(3, "Username minimal 3 karakter.")
      .max(50, "Username maksimal 50 karakter.")
      .regex(
        /^[a-zA-Z0-9._-]+$/,
        "Username hanya boleh mengandung huruf, angka, titik, underscore, atau dash.",
      )
      .transform((value) => value.toLowerCase()),

    password: z.string().min(1, "Password wajib diisi."),
  }),
});
