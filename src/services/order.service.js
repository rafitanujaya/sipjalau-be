import { randomInt, randomUUID } from "node:crypto";

import { pool } from "../db/pool.js";
import { AppError } from "../errors/app-error.js";
import {
  createCustomers,
  findCustomerByFullnameAndPhoneNumber,
} from "../repositories/product.repository.js";
import { findServicesByIds } from "../repositories/service.repository.js";
import {
  createOrder,
  createOrderItem,
  findAvailableOrders,
  findInvoicesByPeriod,
  findOrderById,
  findOrderItemsByOrderId,
} from "../repositories/order.repository.js";

function generateInvoiceNumber() {
  const now = new Date();

  const date = now.toISOString().slice(0, 10).replaceAll("-", "");

  const randomNumber = randomInt(1000, 10000);

  return `INV-${date}-${randomNumber}`;
}

function validateAndCalculateItem(inputItem, service) {
  const unitPrice = Number(service.price);

  if (!Number.isSafeInteger(unitPrice)) {
    throw new AppError(`Harga layanan ${service.name} tidak valid.`, 500);
  }

  switch (service.pricing_unit) {
    case "per_kg": {
      if (
        inputItem.weight == null ||
        inputItem.quantity != null ||
        inputItem.length != null
      ) {
        throw new AppError(
          `Layanan ${service.name} menggunakan satuan kilogram. Hanya weight yang boleh diisi.`,
          422,
        );
      }

      return {
        weight: inputItem.weight,
        quantity: null,
        length: null,
        unitPrice,
        subtotal: Math.round(inputItem.weight * unitPrice),
      };
    }

    case "per_barang": {
      if (
        inputItem.quantity == null ||
        inputItem.weight != null ||
        inputItem.length != null
      ) {
        throw new AppError(
          `Layanan ${service.name} menggunakan satuan per barang. Hanya quantity yang boleh diisi.`,
          422,
        );
      }

      return {
        weight: null,
        quantity: inputItem.quantity,
        length: null,
        unitPrice,
        subtotal: inputItem.quantity * unitPrice,
      };
    }

    case "per_meter": {
      if (
        inputItem.length == null ||
        inputItem.weight != null ||
        inputItem.quantity != null
      ) {
        throw new AppError(
          `Layanan ${service.name} menggunakan satuan meter. Hanya length yang boleh diisi.`,
          422,
        );
      }

      return {
        weight: null,
        quantity: null,
        length: inputItem.length,
        unitPrice,
        subtotal: Math.round(inputItem.length * unitPrice),
      };
    }

    default:
      throw new AppError(
        `Satuan harga layanan ${service.name} tidak valid.`,
        500,
      );
  }
}

function calculateEstimatedDoneAt(receivedAt, services) {
  const longestDuration = Math.max(
    ...services.map((service) => service.duration_days),
  );

  const estimatedDoneAt = new Date(receivedAt);

  estimatedDoneAt.setDate(estimatedDoneAt.getDate() + longestDuration);

  return estimatedDoneAt;
}

export async function createNewOrder(input, cashierId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const customerInput = {
      fullname: input.customer.fullname,
      phoneNumber: input.customer.phoneNumber,
    };

    let customer = await findCustomerByFullnameAndPhoneNumber(
      customerInput.fullname,
      customerInput.phoneNumber,
      client,
    );

    if (!customer) {
      customer = await createCustomers(
        {
          id: randomUUID(),
          ...customerInput,
        },
        client,
      );
    }

    const uniqueServiceIds = [
      ...new Set(input.items.map((item) => item.serviceId)),
    ];

    const services = await findServicesByIds(uniqueServiceIds, client);

    if (services.length !== uniqueServiceIds.length) {
      const foundIds = new Set(services.map((service) => service.id));

      const unavailableIds = uniqueServiceIds.filter((id) => !foundIds.has(id));

      throw new AppError("Terdapat layanan yang tidak ditemukan.", 404, {
        serviceIds: unavailableIds,
      });
    }

    const invalidTurnaroundServices = services.filter(
      (service) => service.turnaround_type !== input.turnaroundType,
    );

    if (invalidTurnaroundServices.length > 0) {
      throw new AppError(
        `Semua layanan harus menggunakan jenis pengerjaan ${input.turnaroundType}.`,
        422,
        {
          services: invalidTurnaroundServices.map((service) => ({
            id: service.id,
            name: service.name,
            turnaroundType: service.turnaround_type,
          })),
        },
      );
    }

    const serviceMap = new Map(
      services.map((service) => [service.id, service]),
    );

    const preparedItems = input.items.map((item) => {
      const service = serviceMap.get(item.serviceId);

      const calculated = validateAndCalculateItem(item, service);

      return {
        id: randomUUID(),
        serviceId: service.id,
        service,
        ...calculated,
      };
    });

    const total = preparedItems.reduce(
      (currentTotal, item) => currentTotal + item.subtotal,
      0,
    );

    const receivedAt = new Date();

    const estimatedDoneAt = calculateEstimatedDoneAt(receivedAt, services);

    const paymentMethod =
      input.paymentStatus === "lunas" ? input.paymentMethod : null;

    const paidAt = input.paymentStatus === "lunas" ? receivedAt : null;

    const orderId = randomUUID();

    const order = await createOrder(client, {
      id: orderId,
      invoiceNumber: generateInvoiceNumber(),
      customerId: customer.id,
      cashierId,
      paymentMethod,
      paymentStatus: input.paymentStatus,
      total,
      notes: input.notes ?? null,
      receivedAt,
      estimatedDoneAt,
      paidAt,
    });

    const orderItems = [];

    for (const item of preparedItems) {
      const createdItem = await createOrderItem(client, {
        id: item.id,
        orderId,
        serviceId: item.serviceId,
        weight: item.weight,
        quantity: item.quantity,
        length: item.length,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
      });

      orderItems.push({
        ...createdItem,
        service: {
          id: item.service.id,
          name: item.service.name,
          pricing_unit: item.service.pricing_unit,
        },
      });
    }

    await client.query("COMMIT");

    return {
      order,
      customer,
      items: orderItems,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function getAvailableOrders() {
  return findAvailableOrders();
}

function createInvoicePeriod(month, year) {
  const monthString = String(month).padStart(2, "0");

  const startDate = new Date(`${year}-${monthString}-01T00:00:00+07:00`);

  let nextMonth = month + 1;
  let nextYear = year;

  if (nextMonth === 13) {
    nextMonth = 1;
    nextYear += 1;
  }

  const nextMonthString = String(nextMonth).padStart(2, "0");

  const endDate = new Date(`${nextYear}-${nextMonthString}-01T00:00:00+07:00`);

  return {
    startDate,
    endDate,
  };
}

export async function getInvoices({ month, year, search }) {
  const { startDate, endDate } = createInvoicePeriod(month, year);

  const invoices = await findInvoicesByPeriod({
    startDate,
    endDate,
    search,
  });

  return invoices.map((invoice) => ({
    orderId: invoice.order_id,
    invoiceNumber: invoice.invoice_number,
    customerName: invoice.customer_name,
    orderDate: invoice.order_date,
    total: Number(invoice.total),
  }));
}

function formatOrderItem(item) {
  let measurement = null;

  switch (item.pricing_unit) {
    case "per_kg":
      measurement = {
        type: "weight",
        value: Number(item.weight),
        unit: "kg",
      };
      break;

    case "per_barang":
      measurement = {
        type: "quantity",
        value: item.quantity,
        unit: "barang",
      };
      break;

    case "per_meter":
      measurement = {
        type: "length",
        value: Number(item.length),
        unit: "meter",
      };
      break;

    default:
      measurement = null;
  }

  return {
    id: item.id,

    service: {
      id: item.service_id,
      name: item.service_name,
      itemCategory: item.item_category,
      itemSize: item.item_size,
      type: item.service_type,
      turnaroundType: item.turnaround_type,
      durationDays: item.duration_days,
      pricingUnit: item.pricing_unit,
    },

    weight: item.weight === null ? null : Number(item.weight),

    quantity: item.quantity,

    length: item.length === null ? null : Number(item.length),

    measurement,

    unitPrice: Number(item.unit_price),
    subtotal: Number(item.subtotal),

    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}

export async function getOrderDetail(id) {
  const order = await findOrderById(id);

  if (!order) {
    throw new AppError("Pesanan tidak ditemukan.", 404);
  }

  const orderItems = await findOrderItemsByOrderId(id);

  return {
    id: order.id,
    invoiceNumber: order.invoice_number,
    status: order.status,
    paymentMethod: order.payment_method,
    paymentStatus: order.payment_status,
    total: Number(order.total),
    notes: order.notes,

    receivedAt: order.received_at,
    estimatedDoneAt: order.estimated_done_at,
    completedAt: order.completed_at,
    pickedUpAt: order.picked_up_at,
    paidAt: order.paid_at,
    createdAt: order.created_at,
    updatedAt: order.updated_at,

    customer: {
      id: order.customer_id,
      fullname: order.customer_fullname,
      phoneNumber: order.customer_phone_number,
    },

    cashier: {
      id: order.cashier_id,
      name: order.cashier_name,
      username: order.cashier_username,
    },

    items: orderItems.map(formatOrderItem),
  };
}
