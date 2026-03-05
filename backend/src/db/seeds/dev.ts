import { hashPassword } from "../../lib/crypto/index.js";
import { upsertSeedProductFile } from "../repositories/product-files.js";
import { upsertSeedProduct } from "../repositories/products.js";
import { upsertDevUser } from "../repositories/users.js";
import pg from "pg";
import { getEnv } from "../../config/env.js";

const { Pool } = pg;

const env = getEnv();

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 2
});

async function seed(): Promise<void> {
  const product = await upsertSeedProduct(pool, {
    slug: "starter-product",
    title: "Starter Product",
    description: "Starter catalog item for local development.",
    isActive: true,
    priceCents: 4900,
    currency: "USD"
  });

  await upsertSeedProductFile(pool, {
    productId: product.id,
    kind: "pdf",
    displayName: "Starter Product PDF",
    mimeType: "application/pdf",
    byteSize: 128_000,
    storageKey: "local/starter-product.pdf"
  });

  await upsertSeedProductFile(pool, {
    productId: product.id,
    kind: "epub",
    displayName: "Starter Product EPUB",
    mimeType: "application/epub+zip",
    byteSize: 96_000,
    storageKey: "local/starter-product.epub"
  });

  const passwordHash = await hashPassword("local-dev-password");

  await upsertDevUser(pool, {
    email: "dev@example.com",
    passwordHash,
    role: "customer"
  });
}

try {
  await seed();
  console.log("Seeded dev data.");
} finally {
  await pool.end();
}
