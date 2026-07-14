import { pool } from "../db/pool.js";

export async function createCustomers({id, fullname, phoneNumber}, db = pool) {
    const result = await db.query(
        `
        INSERT INTO customers(id, fullname, phone_number)
        VALUES($1, $2, $3) RETURNING id, fullname, phone_number
        `,
        [id, fullname, phoneNumber]
    )

    return result.rows[0];
}

export async function findCustomerByFullnameAndPhoneNumber(fullname, phoneNumber, db = pool) {
    const result = await db.query(`SELECT id, fullname, phone_number FROM customers WHERE fullname = $1 AND phone_number = $2`, [fullname, phoneNumber])

    return result.rows[0] ?? null
}