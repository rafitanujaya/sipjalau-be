import { Router } from "express";
import { authRouter } from "./auth.router.js";

export const apiRouter = Router();

apiRouter.get(
  "/health",
  (req, res) => {
    res.status(200).json({
      success: true,
      message:
        "Laundry API berhasil dijalankan.",
    });
  },
);

apiRouter.use(
  "/auth",
  authRouter,
);