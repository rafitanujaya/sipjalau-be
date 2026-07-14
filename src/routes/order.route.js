import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { createOrderSchema } from "../schemas/order.schema.js";
import { handleCreateOrder, handleGetOrder } from "../controllers/order.controller.js";
import { validateRequest } from "../middlewares/validate.js";

export const orderRouter = Router();

orderRouter.get("/", authenticate, handleGetOrder)
orderRouter.post(
  "/",
  authenticate,
  validateRequest(createOrderSchema),
  handleCreateOrder,
);