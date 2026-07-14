import { pool } from "../db/pool.js";

export async function findAllServices(db = pool) {
  const result = await db.query(`
    SELECT
      id,
      name,
      item_category,
      item_size,
      type,
      turnaround_type,
      duration_days,
      pricing_unit,
      price
    FROM services
    ORDER BY
      item_category ASC,
      turnaround_type ASC,
      price ASC
  `);

  return result.rows;
}

export async function findServicesByIds(
  serviceIds,
  db = pool,
) {
  const result = await db.query(
    `
      SELECT
        id,
        name,
        item_category,
        item_size,
        type,
        turnaround_type,
        duration_days,
        pricing_unit,
        price
      FROM services
      WHERE id = ANY($1::varchar[])
    `,
    [serviceIds],
  );

  return result.rows;
}