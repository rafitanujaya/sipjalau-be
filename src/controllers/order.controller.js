import {
  createNewOrder,
  getAvailableOrders,
  getInvoices,
  getOrderDetail,
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

export async function handleGetAllInvoices(req, res, next) {
  try {
    const { month, year, search } = req.validated.query;

    const invoices = await getInvoices({
      month,
      year,
      search,
    });

    return res.status(200).json({
      success: true,
      message: "Daftar faktur berhasil diambil.",
      data: {
        period: {
          month,
          year,
        },
        search,
        total: invoices.length,
        invoices,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function handleGetOrderById(req, res, next) {
  try {
    const order = await getOrderDetail(req.validated.params.id);

    return res.status(200).json({
      success: true,
      message: "Detail pesanan berhasil diambil.",
      data: {
        order,
      },
    });
  } catch (error) {
    next(error);
  }
}
