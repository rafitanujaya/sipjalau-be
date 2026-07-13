import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { AppError } from "../errors/app-error.js";
import {
  createStaff,
  existsStaffByUsername,
  findStaffByUsername,
} from "../repositories/staff.repository.js";
import { createAccessToken } from "../utils/jwt.js";

const PASSWORD_SALT_ROUNDS = 12;

export async function registerStaff(payload) {
  const existingUsername = await existsStaffByUsername(payload.username);

  if (existingUsername) {
    throw new AppError("Username sudah digunakan", 409);
  }

  const passwordHash = await bcrypt.hash(
    payload.password,
    PASSWORD_SALT_ROUNDS,
  );

  const user = await createStaff({
    id: randomUUID(),
    name: payload.name,
    username: payload.username,
    password: passwordHash,
    role: payload.role,
  });

  return user;
}

export async function loginStaff(payload) {
  const staff = await findStaffByUsername(payload.username);
  console.info(staff);

  if (!staff) {
    throw new AppError("Username atau password salah.", 401);
  }

  const passwordMatches = await bcrypt.compare(payload.password, staff.password);

  if (!passwordMatches) {
    throw new AppError("Username atau password salah.", 401);
  }

  const token = createAccessToken(staff);

  return {
    token
  }
}

export async function getCurrentUser(userId) {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("Pengguna tidak ditemukan.", 404);
  }

  return user;
}
