import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce
    .number()
    .int()
    .positive()
    .default(5000),

  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL wajib diisi."),

  DATABASE_SSL: z
    .enum(["true", "false"])
    .default("false"),

  CLIENT_ORIGIN: z
    .string()
    .url("CLIENT_ORIGIN harus berupa URL."),

  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET minimal 32 karakter."),

  JWT_EXPIRES_IN: z
    .string()
    .default("1d"),

  AUTH_COOKIE_NAME: z
    .string()
    .default("laundry_access_token"),

  COOKIE_MAX_AGE_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(86_400_000),
  COOKIE_SAME_SITE: z
    .enum(["lax", "strict", "none"])
    .default("lax"),

  COOKIE_SECURE: z
    .enum(["true", "false"])
    .default("false")
    .transform((value) => value === "true"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "Environment variable tidak valid:",
    parsedEnv.error.flatten().fieldErrors,
  );

  process.exit(1);
}

export const env = parsedEnv.data;