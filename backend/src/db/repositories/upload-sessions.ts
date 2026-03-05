import type { Pool } from "pg";
import type { UploadSessionRow, UploadSessionStatus } from "../types.js";

type Queryable = Pick<Pool, "query">;

export async function createUploadSession(
  pool: Queryable,
  input: {
    createdByUserId: string;
    storageKey: string;
    contentType: string;
    expectedSize: number;
    checksumSha256?: string;
    expiresAt: Date;
    productId?: string;
    metadata?: Record<string, unknown>;
  }
): Promise<UploadSessionRow> {
  const result = await pool.query<UploadSessionRow>(
    `insert into upload_sessions
      (
        created_by_user_id,
        storage_key,
        content_type,
        expected_size,
        checksum_sha256,
        expires_at,
        product_id,
        metadata
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8)
      returning *`,
    [
      input.createdByUserId,
      input.storageKey,
      input.contentType,
      input.expectedSize,
      input.checksumSha256 ?? null,
      input.expiresAt,
      input.productId ?? null,
      JSON.stringify(input.metadata ?? {})
    ]
  );

  return result.rows[0]!;
}

export async function findUploadSessionById(
  pool: Queryable,
  uploadSessionId: string
): Promise<UploadSessionRow | null> {
  const result = await pool.query<UploadSessionRow>(
    `select *
      from upload_sessions
      where id = $1`,
    [uploadSessionId]
  );

  return result.rows[0] ?? null;
}

export async function updateUploadSessionStatus(
  pool: Queryable,
  uploadSessionId: string,
  status: UploadSessionStatus,
  completedAt?: Date
): Promise<UploadSessionRow | null> {
  const result = await pool.query<UploadSessionRow>(
    `update upload_sessions
      set status = $2,
          completed_at = $3,
          updated_at = current_timestamp
      where id = $1
      returning *`,
    [uploadSessionId, status, completedAt ?? null]
  );

  return result.rows[0] ?? null;
}
