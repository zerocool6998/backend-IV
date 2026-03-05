import type { Pool } from "pg";
import { findActiveProductsByIds } from "../../../db/repositories/products.js";
import type { ProductRow } from "../../../db/types.js";
import { HttpError } from "../../../lib/http/exceptions.js";

export async function findProductsByIds(pool: Pool, productIds: string[]): Promise<ProductRow[]> {
  const products = await findActiveProductsByIds(pool, productIds);

  if (products.length !== productIds.length) {
    throw new HttpError(400, "CHECKOUT_INVALID_PRODUCTS", "One or more products are unavailable");
  }

  return products;
}
