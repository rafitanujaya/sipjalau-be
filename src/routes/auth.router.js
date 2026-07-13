import { Router } from "express";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";
import {
  handleLoginStaff,
  handleMe,
  handleRegisterStaff,
} from "../controllers/auth.controller.js";
import { validateRequest } from "../middlewares/validate.js";
import { authenticate } from "../middlewares/authenticate.js";

export const authRouter = Router();

authRouter.post( "/register", validateRequest(registerSchema), handleRegisterStaff);
authRouter.post("/login", validateRequest(loginSchema), handleLoginStaff);
authRouter.get("/me", authenticate, handleMe)