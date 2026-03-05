import type { Pool } from "pg";
import type { DownloadLinkChannel, DownloadLinkEventRow } from "../types.js";

type Queryable = Pick<Pool, "query">;

export async function acquireDownloadRateLimitLock(
  pool: Queryable,
  identityKey: string,
  productId: string
): Promise<void> {
  await pool.query(
    `select pg_advisory_xact_lock(hashtextextended($1 || ':' || $2, 0))`,
    [identityKey, productId]
  );
}

export async function countRecentIssuedByIdentityAndProduct(
  pool: Queryable,
  identityKey: string,
  productId: string,
  since: Date
): Promise<number> {
  const result = await pool.query<{ count: string }>(
    `select count(*)::text as count
      from download_link_events
      where identity_key = $1
        and product_id = $2
        and outcome = 'issued'
        and created_at >= $3`,
    [identityKey, productId, since]
  );

  return Number(result.rows[0]?.count ?? "0");
}

export async function insertDownloadLinkEvent(
  pool: Queryable,
  input: {
    userId?: string;
    orderId?: string;
    identityKey?: string;
    productId: string;
    productFileId?: string;
    channel: DownloadLinkChannel;
    outcome: "issued" | "denied";
    denyReason?: string;
    expiresAt?: Date;
    requestId?: string;
  }
): Promise<DownloadLinkEventRow> {
  const result = await pool.query<DownloadLinkEventRow>(
    `insert into download_link_events
      (
        user_id,
        order_id,
        identity_key,
        product_id,
        product_file_id,
        channel,
        outcome,
        deny_reason,
        expires_at,
        request_id
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      returning *`,
    [
      input.userId ?? null,
      input.orderId ?? null,
      input.identityKey ?? null,
      input.productId,
      input.productFileId ?? null,
      input.channel,
      input.outcome,
      input.denyReason ?? null,
      input.expiresAt ?? null,
      input.requestId ?? null
    ]
  );

  return result.rows[0]!;
}
