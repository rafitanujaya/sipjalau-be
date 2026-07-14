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

      st.id AS cashier_id,
      st.name AS cashier_name,

      (
        SELECT sv.turnaround_type
        FROM order_items AS oi
        INNER JOIN services AS sv
          ON sv.id = oi.service_id
        WHERE oi.order_id = o.id
        LIMIT 1
      ) AS turnaround_type

    FROM orders AS o

    INNER JOIN customers AS c
      ON c.id = o.customer_id

    INNER JOIN staff AS st
      ON st.id = o.cashier_id

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
        ELSE 4
      END,
      o.received_at ASC
  `);

  return result.rows;
}

export async function findInvoicesByPeriod(
  {
    startDate,
    endDate,
    search,
  },
  db = pool,
) {
  const keyword = `%${search}%`;

  const result = await db.query(
    `
      SELECT
        o.id AS order_id,
        o.invoice_number,
        c.fullname AS customer_name,
        o.created_at AS order_date,
        o.total

      FROM orders AS o

      INNER JOIN customers AS c
        ON c.id = o.customer_id

      WHERE o.status = 'sudah_diambil'

        AND o.created_at >= $1
        AND o.created_at < $2

        AND (
          $3 = ''
          OR o.invoice_number ILIKE $4
          OR c.fullname ILIKE $4
        )

      ORDER BY o.created_at DESC
    `,
    [
      startDate,
      endDate,
      search,
      keyword,
    ],
  );

  return result.rows;
}

export async function findOrderById(
  id,
  db = pool,
) {
  const result = await db.query(
    `
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
        o.picked_up_at,
        o.paid_at,
        o.created_at,
        o.updated_at,

        c.id AS customer_id,
        c.fullname AS customer_fullname,
        c.phone_number AS customer_phone_number,

        s.id AS cashier_id,
        s.name AS cashier_name,
        s.username AS cashier_username

      FROM orders AS o

      INNER JOIN customers AS c
        ON c.id = o.customer_id

      INNER JOIN staff AS s
        ON s.id = o.cashier_id

      WHERE o.id = $1

      LIMIT 1
    `,
    [id],
  );

  return result.rows[0] ?? null;
}

export async function findOrderItemsByOrderId(
  orderId,
  db = pool,
) {
  const result = await db.query(
    `
      SELECT
        oi.id,
        oi.order_id,
        oi.service_id,
        oi.weight,
        oi.quantity,
        oi.length,
        oi.unit_price,
        oi.subtotal,
        oi.created_at,
        oi.updated_at,

        sv.name AS service_name,
        sv.item_category,
        sv.item_size,
        sv.type AS service_type,
        sv.turnaround_type,
        sv.duration_days,
        sv.pricing_unit

      FROM order_items AS oi

      INNER JOIN services AS sv
        ON sv.id = oi.service_id

      WHERE oi.order_id = $1

      ORDER BY oi.created_at ASC
    `,
    [orderId],
  );

  return result.rows;
}

export async function findOrderStatusById(
  id,
  db = pool,
) {
  const result = await db.query(
    `
      SELECT
        id,
        status,
        payment_status,
        completed_at,
        picked_up_at
      FROM orders
      WHERE id = $1
      LIMIT 1
    `,
    [id],
  );

  return result.rows[0] ?? null;
}

export async function updateOrderStatus(
  id,
  {
    status,
    completedAt,
    pickedUpAt,
  },
  db = pool,
) {
  const result = await db.query(
    `
      UPDATE orders
      SET
        status = $2,
        completed_at = $3,
        picked_up_at = $4,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING
        id,
        invoice_number,
        status,
        payment_method,
        payment_status,
        total,
        received_at,
        estimated_done_at,
        completed_at,
        picked_up_at,
        paid_at,
        created_at,
        updated_at
    `,
    [
      id,
      status,
      completedAt,
      pickedUpAt,
    ],
  );

  return result.rows[0] ?? null;
}

export async function findOrderPaymentById(
  id,
  db = pool,
) {
  const result = await db.query(
    `
      SELECT
        id,
        invoice_number,
        status,
        payment_method,
        payment_status,
        total,
        paid_at
      FROM orders
      WHERE id = $1
      LIMIT 1
    `,
    [id],
  );

  return result.rows[0] ?? null;
}

export async function updateOrderPayment(
  id,
  paymentMethod,
  db = pool,
) {
  const result = await db.query(
    `
      UPDATE orders
      SET
        payment_status = 'lunas',
        payment_method = $2,
        paid_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING
        id,
        invoice_number,
        status,
        payment_method,
        payment_status,
        total,
        paid_at,
        created_at,
        updated_at
    `,
    [
      id,
      paymentMethod,
    ],
  );

  return result.rows[0] ?? null;
}