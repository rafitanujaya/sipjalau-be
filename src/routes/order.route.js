import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import {
  createOrderSchema,
  getOrderByIdSchema,
  updateOrderPaymentSchema,
  updateOrderStatusSchema,
} from "../schemas/order.schema.js";
import {
  handleCreateOrder,
  handleGetOrder,
  handleGetOrderById,
  handleUpdateOrderPayment,
  handleUpdateOrderStatus,
} from "../controllers/order.controller.js";
import { validateRequest } from "../middlewares/validate.js";

export const orderRouter = Router();

orderRouter.get("/", authenticate, handleGetOrder);
orderRouter.post(
  "/",
  authenticate,
  validateRequest(createOrderSchema),
  handleCreateOrder,
);
orderRouter.get(
  "/:id",
  authenticate,
  validateRequest(getOrderByIdSchema),
  handleGetOrderById,
);
orderRouter.patch(
  "/:id/status",
  authenticate,
  validateRequest(updateOrderStatusSchema),
  handleUpdateOrderStatus,
);

orderRouter.patch(
  "/:id/payment",
  authenticate,
  validateRequest(
    updateOrderPaymentSchema,
  ),
  handleUpdateOrderPayment,
);