import type { Pool } from "pg";
import type { ProductFileRow } from "../types.js";

export async function findByProductId(pool: Pool, productId: string): Promise<ProductFileRow[]> {
  const result = await pool.query<ProductFileRow>(
    `select *
      from product_files
      where product_id = $1
      order by kind asc`,
    [productId]
  );

  return result.rows;
}

export async function findByProductIdAndKind(
  pool: Pool,
  productId: string,
  kind: string
): Promise<ProductFileRow | null> {
  const result = await pool.query<ProductFileRow>(
    `select *
      from product_files
      where product_id = $1
        and kind = $2`,
    [productId, kind]
  );

  return result.rows[0] ?? null;
}

export async function upsertSeedProductFile(
  pool: Pool,
  input: {
    productId: string;
    kind: string;
    displayName: string;
    mimeType: string;
    byteSize: number;
    storageKey: string;
    checksumSha256?: string;
  }
): Promise<ProductFileRow> {
  const result = await pool.query<ProductFileRow>(
    `insert into product_files
      (product_id, kind, display_name, mime_type, byte_size, storage_key, checksum_sha256)
      values ($1, $2, $3, $4, $5, $6, $7)
      on conflict (product_id, kind)
      do update set
        display_name = excluded.display_name,
        mime_type = excluded.mime_type,
        byte_size = excluded.byte_size,
        storage_key = excluded.storage_key,
        checksum_sha256 = excluded.checksum_sha256,
        updated_at = current_timestamp
      returning *`,
    [
      input.productId,
      input.kind,
      input.displayName,
      input.mimeType,
      input.byteSize,
      input.storageKey,
      input.checksumSha256 ?? null
    ]
  );

  return result.rows[0]!;
}

export async function attachProductFile(
  pool: Pool,
  input: {
    productId: string;
    kind: string;
    displayName: string;
    mimeType: string;
    byteSize: number;
    storageKey: string;
    checksumSha256?: string;
  }
): Promise<ProductFileRow> {
  return upsertSeedProductFile(pool, input);
}
