import { findDashboardSummary, findOrdersDueToday } from "../repositories/dashboard.repository.js";

export async function getDashboardData() {
  const [
    summary,
    ordersDueToday,
  ] = await Promise.all([
    findDashboardSummary(),
    findOrdersDueToday(),
  ]);

  return {
    totalRunningOrders:
      summary.total_running_orders,

    totalCompletedToday:
      summary.total_completed_today,

    ordersDueToday:
      ordersDueToday.map((order) => ({
        id: order.id,
        invoiceNumber:
          order.invoice_number,
        customerFullname:
          order.customer_fullname,
        orderDate:
          order.order_date,
        total: Number(order.total),
      })),
  };
}