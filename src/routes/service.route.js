import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { handleGetServices } from "../controllers/service.controller.js";

export const serviceRouter = Router();

serviceRouter.get("/", authenticate, handleGetServices);
