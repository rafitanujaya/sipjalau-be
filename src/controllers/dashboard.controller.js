import {
  getDashboardData,
} from "../services/dashboard.service.js";

export async function handleGetDashboard(
  req,
  res,
  next,
) {
  try {
    const dashboard =
      await getDashboardData();

    return res.status(200).json({
      success: true,
      message:
        "Data dashboard berhasil diambil.",
      data: dashboard,
    });
  } catch (error) {
    next(error);
  }
}