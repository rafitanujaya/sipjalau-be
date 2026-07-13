import { env } from "./env.js";

export const authCookieOptions = {
  httpOnly: true,
  secure: env.COOKIE_SECURE,
  sameSite: env.COOKIE_SAME_SITE,
  maxAge: env.COOKIE_MAX_AGE_MS,
  path: "/",
};

export const clearAuthCookieOptions = {
  httpOnly: true,
  secure: env.COOKIE_SECURE,
  sameSite: env.COOKIE_SAME_SITE,
  path: "/",
};