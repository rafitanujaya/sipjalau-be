import { pool } from "../db/pool.js";


export async function createOrder(
  client,
  {
    id,
    invoiceNumber,
    customerId,
    cashierId,
    paymentMethod,
    paymentStatus,
    total,
    notes,
    receivedAt,
    estimatedDoneAt,
    paidAt,
  },
) {
  const result = await client.query(
    `
      INSERT INTO orders (
        id,
        invoice_number,
        customer_id,
        cashier_id,
        status,
        payment_method,
        payment_status,
        total,
        notes,
        received_at,
        estimated_done_at,
        paid_at
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        'diproses',
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        $11
      )
      RETURNING
        id,
        invoice_number,
        customer_id,
        cashier_id,
        status,
        payment_method,
        payment_status,
        total,
        notes,
        received_at,
        estimated_done_at,
        paid_at,
        created_at,
        updated_at
    `,
    [
      id,
      invoiceNumber,
      customerId,
      cashierId,
      paymentMethod,
      paymentStatus,
      total,
      notes,
      receivedAt,
      estimatedDoneAt,
      paidAt,
    ],
  );

  return result.rows[0];
}

export async function createOrderItem(
  client,
  {
    id,
    orderId,
    serviceId,
    weight,
    quantity,
    length,
    unitPrice,
    subtotal,
  },
) {
  const result = await client.query(
    `
      INSERT INTO order_items (
        id,
        order_id,
        service_id,
        weight,
        quantity,
        length,
        unit_price,
        subtotal
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8
      )
      RETURNING
        id,
        order_id,
        service_id,
        weight,
        quantity,
        length,
        unit_price,
        subtotal,
        created_at,
        updated_at
    `,
    [
      id,
      orderId,
      serviceId,
      weight,
      quantity,
      length,
      unitPrice,
      subtotal,
    ],
  );

  return result.rows[0];
}

export async function findAvailableOrders(db = pool) {
  console.time("findAvailableOrders");

  try {
    const result = await db.query(`
      SELECT
        o.id,
        o.invoice_number,
        o.status,
        o.payment_method,
        o.payment_status,
        o.total,
        o.notes,
        o.received_at,
        o.estimated_done_at,
        o.completed_at,
        o.paid_at,
        o.created_at,
        o.updated_at,

        c.id AS customer_id,
        c.fullname AS customer_name,
        c.phone_number AS customer_phone_number,

        s.id AS cashier_id,
        s.name AS cashier_name

      FROM orders o

      INNER JOIN customers c
        ON c.id = o.customer_id

      INNER JOIN staff s
        ON s.id = o.cashier_id

      WHERE o.status IN (
        'diproses',
        'sedang_dicuci',
        'siap_diambil'
      )

      ORDER BY
        CASE o.status
          WHEN 'siap_diambil' THEN 1
          WHEN 'sedang_dicuci' THEN 2
          WHEN 'diproses' THEN 3
        END,
        o.received_at ASC
    `);

    return result.rows;
  } finally {
    console.timeEnd("findAvailableOrders");
  }
}