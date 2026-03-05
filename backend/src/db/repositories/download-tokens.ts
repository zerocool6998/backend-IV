import type { Pool } from "pg";
import type { DownloadTokenRow } from "../types.js";

type Queryable = Pick<Pool, "query">;

export async function createOrRefreshDownloadToken(
  pool: Queryable,
  input: {
    orderId: string;
    tokenHash: string;
    expiresAt: Date;
  }
): Promise<DownloadTokenRow> {
  const result = await pool.query<DownloadTokenRow>(
    `insert into download_tokens (order_id, token_hash, expires_at)
      values ($1, $2, $3)
      on conflict (order_id)
      do update set
        token_hash = excluded.token_hash,
        expires_at = excluded.expires_at
      returning *`,
    [input.orderId, input.tokenHash, input.expiresAt]
  );

  return result.rows[0]!;
}

export async function findByTokenHash(
  pool: Queryable,
  tokenHash: string
): Promise<DownloadTokenRow | null> {
  const result = await pool.query<DownloadTokenRow>(
    `select *
      from download_tokens
      where token_hash = $1`,
    [tokenHash]
  );

  return result.rows[0] ?? null;
}

export async function expireDownloadTokenForOrder(
  pool: Queryable,
  orderId: string
): Promise<DownloadTokenRow | null> {
  const result = await pool.query<DownloadTokenRow>(
    `update download_tokens
      set expires_at = current_timestamp
      where order_id = $1
      returning *`,
    [orderId]
  );

  return result.rows[0] ?? null;
}
