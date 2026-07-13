import { env } from "../config/env.js";

import { AppError } from "../shared/errors/app-error.js";
import { verifyAccessToken } from "../shared/utils/jwt.js";

export function authenticate(
  req,
  res,
  next,
) {
  const token =
    req.cookies?.[
      env.AUTH_COOKIE_NAME
    ];

  if (!token) {
    return next(
      new AppError(
        "Kamu belum login.",
        401,
      ),
    );
  }

  try {
    const payload =
      verifyAccessToken(token);

    req.auth = {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };

    next();
  } catch {
    next(
      new AppError(
        "Sesi login tidak valid atau sudah berakhir.",
        401,
      ),
    );
  }
}