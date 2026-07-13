import { pool } from "../db/pool.js";

export async function existsStaffByUsername(username, db = pool) {
  const result = await db.query(
    `
      SELECT id FROM staff WHERE username = $1;
    `,
    [username]
  )

  return result.rowCount > 0;
}

export async function findStaffByUsername(username, db = pool) {
  const result = await db.query(
    `
      SELECT
        id,
        name,
        username,
        password,
        role
      FROM staff
      WHERE username = $1
      LIMIT 1
    `,
    [username],
  );

  return result.rows[0] ?? null;
}

export async function findStaffById(id, db = pool) {
  const result = await pool.query(
    `
      SELECT
        id,
        name,
        username,
        role,
        created_at,
        updated_at
      FROM staff
      WHERE id = $1
      LIMIT 1
    `,
    [id],
  );

  return result.rows[0] ?? null;
}

export async function createStaff(
  { id, name, username, password, role },
  db = pool,
) {
  const result = await db.query(
    `
      INSERT INTO staff(
        id,
        name,
        username,
        password,
        role
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        id,
        name,
        username,
        role,
        created_at,
        updated_at
    `,
    [id, name, username, password, role],
  );

  return result.rows[0];
}
