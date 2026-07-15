import { pool } from "../db/pool.js"; 

export async function findDashboardSummary(
  db = pool,
) {
  const result = await db.query(`
    SELECT
      COUNT(*) FILTER (
        WHERE status IN (
          'diproses',
          'sedang_dicuci',
          'siap_diambil'
        )
      )::integer AS total_running_orders,

      COUNT(*) FILTER (
        WHERE status IN (
          'diproses',
          'sedang_dicuci',
          'siap_diambil'
        )

        AND estimated_done_at >=
          DATE_TRUNC(
            'day',
            CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Jakarta'
          ) AT TIME ZONE 'Asia/Jakarta'

        AND estimated_done_at <
          (
            DATE_TRUNC(
              'day',
              CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Jakarta'
            )
            + INTERVAL '1 day'
          ) AT TIME ZONE 'Asia/Jakarta'
      )::integer AS total_due_today

    FROM orders
  `);

  return result.rows[0];
}

export async function findOrdersDueToday(db = pool) {
  const result = await db.query(`
    SELECT
      o.id,
      o.invoice_number,
      c.fullname AS customer_fullname,
      o.created_at AS order_date,
      o.total

    FROM orders AS o

    INNER JOIN customers AS c
      ON c.id = o.customer_id

    WHERE o.status IN (
      'diproses',
      'sedang_dicuci',
      'siap_diambil'
    )

    AND o.estimated_done_at >=
      DATE_TRUNC(
        'day',
        CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Jakarta'
      ) AT TIME ZONE 'Asia/Jakarta'

    AND o.estimated_done_at <
      (
        DATE_TRUNC(
          'day',
          CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Jakarta'
        )
        + INTERVAL '1 day'
      ) AT TIME ZONE 'Asia/Jakarta'

    ORDER BY
      CASE o.status
        WHEN 'siap_diambil' THEN 1
        WHEN 'sedang_dicuci' THEN 2
        WHEN 'diproses' THEN 3
        ELSE 4
      END,
      o.estimated_done_at ASC
  `);

  return result.rows;
}