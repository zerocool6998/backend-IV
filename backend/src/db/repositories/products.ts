import type { Pool } from "pg";
import type { ProductRow } from "../types.js";

type Queryable = Pick<Pool, "query">;

export type PublicProduct = {
  id: string;
  slug: string;
  title: string;
  description: string;
  priceCents: number;
  currency: string;
};

function toPublicProduct(row: ProductRow): PublicProduct {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    priceCents: row.price_cents,
    currency: row.currency
  };
}

export async function listActiveProducts(pool: Queryable): Promise<PublicProduct[]> {
  const result = await pool.query<ProductRow>(
    `select *
      from products
      where is_active = true
      order by created_at asc`
  );

  return result.rows.map(toPublicProduct);
}

export async function findActiveProductById(
  pool: Queryable,
  productId: string
): Promise<PublicProduct | null> {
  const result = await pool.query<ProductRow>(
    `select *
      from products
      where id = $1
        and is_active = true`,
    [productId]
  );

  const row = result.rows[0];

  return row ? toPublicProduct(row) : null;
}

export async function findProductById(pool: Queryable, productId: string): Promise<PublicProduct | null> {
  const result = await pool.query<ProductRow>(
    `select *
      from products
      where id = $1`,
    [productId]
  );

  const row = result.rows[0];

  return row ? toPublicProduct(row) : null;
}

export async function listFormatsForProduct(pool: Queryable, productId: string): Promise<string[]> {
  const result = await pool.query<{ kind: string }>(
    `select kind
      from product_files
      where product_id = $1
      order by kind asc`,
    [productId]
  );

  return result.rows.map((row) => row.kind);
}

export async function findActiveProductsByIds(
  pool: Queryable,
  productIds: string[]
): Promise<ProductRow[]> {
  if (productIds.length === 0) {
    return [];
  }

  const result = await pool.query<ProductRow>(
    `select *
      from products
      where id = any($1::uuid[])
        and is_active = true`,
    [productIds]
  );

  return result.rows;
}

export async function upsertSeedProduct(
  pool: Queryable,
  input: {
    slug: string;
    title: string;
    description: string;
    isActive: boolean;
    priceCents: number;
    currency: string;
  }
): Promise<PublicProduct> {
  const result = await pool.query<ProductRow>(
    `insert into products (slug, title, description, is_active, price_cents, currency)
      values ($1, $2, $3, $4, $5, $6)
      on conflict (slug)
      do update set
        title = excluded.title,
        description = excluded.description,
        is_active = excluded.is_active,
        price_cents = excluded.price_cents,
        currency = excluded.currency,
        updated_at = current_timestamp
      returning *`,
    [
      input.slug,
      input.title,
      input.description,
      input.isActive,
      input.priceCents,
      input.currency
    ]
  );

  return toPublicProduct(result.rows[0]!);
}

export async function createProduct(
  pool: Queryable,
  input: {
    slug: string;
    title: string;
    description: string;
    isActive: boolean;
    priceCents: number;
    currency: string;
  }
): Promise<PublicProduct> {
  const result = await pool.query<ProductRow>(
    `insert into products (slug, title, description, is_active, price_cents, currency)
      values ($1, $2, $3, $4, $5, $6)
      returning *`,
    [
      input.slug,
      input.title,
      input.description,
      input.isActive,
      input.priceCents,
      input.currency
    ]
  );

  return toPublicProduct(result.rows[0]!);
}

export async function updateProduct(
  pool: Queryable,
  productId: string,
  input: Partial<{
    slug: string;
    title: string;
    description: string;
    isActive: boolean;
    priceCents: number;
    currency: string;
  }>
): Promise<PublicProduct | null> {
  const fields: string[] = [];
  const values: unknown[] = [productId];

  if (input.slug !== undefined) {
    values.push(input.slug);
    fields.push(`slug = $${values.length}`);
  }

  if (input.title !== undefined) {
    values.push(input.title);
    fields.push(`title = $${values.length}`);
  }

  if (input.description !== undefined) {
    values.push(input.description);
    fields.push(`description = $${values.length}`);
  }

  if (input.isActive !== undefined) {
    values.push(input.isActive);
    fields.push(`is_active = $${values.length}`);
  }

  if (input.priceCents !== undefined) {
    values.push(input.priceCents);
    fields.push(`price_cents = $${values.length}`);
  }

  if (input.currency !== undefined) {
    values.push(input.currency);
    fields.push(`currency = $${values.length}`);
  }

  if (fields.length === 0) {
    return findProductById(pool, productId);
  }

  fields.push("updated_at = current_timestamp");

  const result = await pool.query<ProductRow>(
    `update products
      set ${fields.join(", ")}
      where id = $1
      returning *`,
    values
  );

  const row = result.rows[0];

  return row ? toPublicProduct(row) : null;
}
