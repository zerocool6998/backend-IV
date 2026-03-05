import type { Pool } from "pg";
import type { EntitlementRow } from "../types.js";

type Queryable = Pick<Pool, "query">;

export async function listEntitlementsForUser(
  pool: Queryable,
  userId: string
): Promise<EntitlementRow[]> {
  const result = await pool.query<EntitlementRow>(
    `select *
      from entitlements
      where user_id = $1
        and status = 'active'
      order by created_at asc`,
    [userId]
  );

  return result.rows;
}

export async function upsertEntitlementForPaidOrder(
  pool: Queryable,
  input: {
    userId: string;
    productId: string;
    orderId: string;
    grantReason?: string;
  }
): Promise<EntitlementRow> {
  const result = await pool.query<EntitlementRow>(
    `insert into entitlements
      (user_id, product_id, first_order_id, last_order_id, grant_reason, status, granted_at, updated_at)
      values ($1, $2, $3, $3, $4, 'active', current_timestamp, current_timestamp)
      on conflict (user_id, product_id)
      do update set
        last_order_id = excluded.last_order_id,
        grant_reason = excluded.grant_reason,
        status = 'active',
        revoked_at = null,
        revoked_reason = null,
        updated_at = current_timestamp
      returning *`,
    [input.userId, input.productId, input.orderId, input.grantReason ?? "purchase"]
  );

  return result.rows[0]!;
}

export async function findByUserAndProduct(
  pool: Queryable,
  userId: string,
  productId: string
): Promise<EntitlementRow | null> {
  const result = await pool.query<EntitlementRow>(
    `select *
      from entitlements
      where user_id = $1
        and product_id = $2`,
    [userId, productId]
  );

  return result.rows[0] ?? null;
}

export async function findActiveEntitlementByUserAndProduct(
  pool: Queryable,
  userId: string,
  productId: string
): Promise<EntitlementRow | null> {
  const result = await pool.query<EntitlementRow>(
    `select *
      from entitlements
      where user_id = $1
        and product_id = $2
        and status = 'active'`,
    [userId, productId]
  );

  return result.rows[0] ?? null;
}

export async function suspendEntitlementsForOrder(
  pool: Queryable,
  input: {
    orderId: string;
    reason: string;
  }
): Promise<EntitlementRow[]> {
  const result = await pool.query<EntitlementRow>(
    `update entitlements
      set status = 'suspended',
          revoked_at = current_timestamp,
          revoked_reason = $2,
          updated_at = current_timestamp
      where last_order_id = $1
      returning *`,
    [input.orderId, input.reason]
  );

  return result.rows;
}
