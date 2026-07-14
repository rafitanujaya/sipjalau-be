import { Router } from "express";
import { authRouter } from "./auth.router.js";
import { serviceRouter } from "./service.route.js";
import { orderRouter } from "./order.route.js";
import { authenticate } from "../middlewares/authenticate.js";
import { handleGetAllInvoices } from "../controllers/order.controller.js";
import { validateRequest } from "../middlewares/validate.js";
import { getInvoicesSchema } from "../schemas/order.schema.js";
import { handleGetDashboard } from "../controllers/dashboard.controller.js";

export const apiRouter = Router();

apiRouter.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Laundry API berhasil dijalankan.",
  });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/services", serviceRouter);
apiRouter.use("/orders", orderRouter);
apiRouter.get("/invoices", authenticate, validateRequest(getInvoicesSchema), handleGetAllInvoices);
apiRouter.get('/dashboard', authenticate, handleGetDashboard)