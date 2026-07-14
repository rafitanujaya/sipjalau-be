import {
  createNewOrder,
  getAvailableOrders,
} from "../services/order.service.js";

export async function handleCreateOrder(req, res, next) {
  try {
    const result = await createNewOrder(req.validated.body, req.auth.userId);

    return res.status(201).json({
      success: true,
      message: "Pesanan berhasil dibuat.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleGetOrder(req, res, next) {
  try {
    const orders = await getAvailableOrders();

    return res.status(200).json({
      success: true,
      message: "Daftar pesanan berhasil diambil.",
      data: {
        orders,
        total: orders.length,
      },
    });
  } catch (error) {}
}
