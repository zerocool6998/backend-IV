import type { Pool } from "pg";
import type { OrderRow, OrderStatus } from "../types.js";

type Queryable = Pick<Pool, "query">;

export async function createOrderFromCheckoutSession(
  pool: Queryable,
  input: {
    identityKey: string;
    userId?: string;
    guestEmail?: string;
    checkoutSessionId: string;
    currency: string;
    subtotalCents: number;
    discountCents?: number;
    taxCents?: number;
    totalCents: number;
    status?: OrderStatus;
  }
): Promise<OrderRow> {
  const result = await pool.query<OrderRow>(
    `insert into orders
      (
        identity_key,
        user_id,
        guest_email,
        checkout_session_id,
        currency,
        subtotal_cents,
        discount_cents,
        tax_cents,
        total_cents,
        status
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      returning *`,
    [
      input.identityKey,
      input.userId ?? null,
      input.guestEmail ?? null,
      input.checkoutSessionId,
      input.currency,
      input.subtotalCents,
      input.discountCents ?? 0,
      input.taxCents ?? 0,
      input.totalCents,
      input.status ?? "pending"
    ]
  );

  return result.rows[0]!;
}

export async function findByCheckoutSessionId(
  pool: Queryable,
  checkoutSessionId: string
): Promise<OrderRow | null> {
  const result = await pool.query<OrderRow>(
    `select *
      from orders
      where checkout_session_id = $1`,
    [checkoutSessionId]
  );

  return result.rows[0] ?? null;
}

export async function findById(pool: Queryable, orderId: string): Promise<OrderRow | null> {
  const result = await pool.query<OrderRow>(
    `select *
      from orders
      where id = $1`,
    [orderId]
  );

  return result.rows[0] ?? null;
}

export async function updateOrderStatus(
  pool: Queryable,
  orderId: string,
  status: OrderStatus
): Promise<OrderRow | null> {
  const result = await pool.query<OrderRow>(
    `update orders
      set status = $2,
          updated_at = current_timestamp
      where id = $1
      returning *`,
    [orderId, status]
  );

  return result.rows[0] ?? null;
}
