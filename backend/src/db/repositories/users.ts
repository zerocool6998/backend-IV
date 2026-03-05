import type { Pool } from "pg";
import type { UserRole, UserRow } from "../types.js";

export async function findUserByEmail(pool: Pool, email: string): Promise<UserRow | null> {
  const result = await pool.query<UserRow>(
    `select *
      from users
      where email = $1`,
    [email]
  );

  return result.rows[0] ?? null;
}

export async function findUserById(pool: Pool, userId: string): Promise<UserRow | null> {
  const result = await pool.query<UserRow>(
    `select *
      from users
      where id = $1`,
    [userId]
  );

  return result.rows[0] ?? null;
}

export async function upsertDevUser(
  pool: Pool,
  input: {
    email: string;
    passwordHash: string;
    role: UserRole;
  }
): Promise<UserRow> {
  const result = await pool.query<UserRow>(
    `insert into users (email, password_hash, role)
      values ($1, $2, $3)
      on conflict (email)
      do update set
        password_hash = excluded.password_hash,
        role = excluded.role,
        updated_at = current_timestamp
      returning *`,
    [input.email, input.passwordHash, input.role]
  );

  return result.rows[0]!;
}
