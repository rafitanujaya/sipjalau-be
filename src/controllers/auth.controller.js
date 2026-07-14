import { success } from "zod";
import { authCookieOptions, clearAuthCookieOptions } from "../config/cookie.js";
import { env } from "../config/env.js";
import { loginStaff, registerStaff } from "../services/auth.service.js";

export async function handleRegisterStaff(req, res, next) {
  try {
    const user = await registerStaff(req.validated.body);

    res.status(201).json({
      success: true,
      message: "Akun staff berhasil dibuat.",
      data: {},
    });
  } catch (error) {
    next(error);
  }
}

export async function handleLoginStaff(req, res, next) {
  try {
    const result = await loginStaff(req.validated.body);

    res.cookie(env.AUTH_COOKIE_NAME, result.token, authCookieOptions);

    res.status(200).json({
      success: true,
      message: "Login berhasil",
      data: {},
    });
  } catch (error) {
    next(error);
  }
}

export async function handleMe(req, res, next) {
  try {
    res.status(200).json({
      success: true,
      message: "Data berhasil diambil",
      data: {
        staffId: req.auth.sub,
        username: req.auth.username,
        role: req.auth.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function handleLogoutStaff(req, res, next) {
  try {
    res.clearCookie(env.AUTH_COOKIE_NAME, clearAuthCookieOptions);

    return res.status(200).json({
      success: true,
      message: "Logout berhasil.",
    });
  } catch (error) {
    next(error);
  }
}
