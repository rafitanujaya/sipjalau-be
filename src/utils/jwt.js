import jwt from "jsonwebtoken";

import { env } from "../config/env.js"; 

export function createAccessToken(staff) {
  return jwt.sign(
    {
      sub: staff.id,
      username: staff.username,
      role: staff.role,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN,
      issuer: "laundry-api",
      audience: "laundry-client",
    },
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(
    token,
    env.JWT_SECRET,
    {
      issuer: "laundry-api",
      audience: "laundry-client",
    },
  );
}