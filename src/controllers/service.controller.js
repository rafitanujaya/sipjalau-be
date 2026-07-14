import { getAvailableServices } from "../services/service.service.js";

export async function handleGetServices(req, res, next) {
  try {
    const result = await getAvailableServices();

    return res.status(200).json({
      success: true,
      message: "Daftar layanan berhasil diambil.",
      data: result
    });
  } catch (error) {
    next(error);
  }
}
