import type { Pool } from "pg";
import type { CheckoutSessionItemRow } from "../types.js";

type Queryable = Pick<Pool, "query">;

export async function addItem(
  pool: Queryable,
  input: {
    checkoutSessionId: string;
    productId: string;
    unitAmountCents: number;
    quantity: number;
  }
): Promise<CheckoutSessionItemRow> {
  const result = await pool.query<CheckoutSessionItemRow>(
    `insert into checkout_session_items
      (checkout_session_id, product_id, unit_amount_cents, quantity)
      values ($1, $2, $3, $4)
      returning *`,
    [input.checkoutSessionId, input.productId, input.unitAmountCents, input.quantity]
  );

  return result.rows[0]!;
}

export async function listItemsForSession(
  pool: Queryable,
  checkoutSessionId: string
): Promise<CheckoutSessionItemRow[]> {
  const result = await pool.query<CheckoutSessionItemRow>(
    `select *
      from checkout_session_items
      where checkout_session_id = $1
      order by created_at asc`,
    [checkoutSessionId]
  );

  return result.rows;
}

export async function listProductIdsForOrder(
  pool: Queryable,
  orderId: string
): Promise<string[]> {
  const result = await pool.query<{ product_id: string }>(
    `select distinct csi.product_id
      from orders o
      join checkout_session_items csi on csi.checkout_session_id = o.checkout_session_id
      where o.id = $1
      order by csi.product_id asc`,
    [orderId]
  );

  return result.rows.map((row) => row.product_id);
}
