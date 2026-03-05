import type { Pool } from "pg";
import type { CheckoutSessionRow, CheckoutSessionState, ProviderType } from "../types.js";

type Queryable = Pick<Pool, "query">;

export async function createCheckoutSessionHeader(
  pool: Queryable,
  input: {
    identityKey: string;
    userId?: string;
    guestEmail?: string;
    guestSecretHash?: string;
    guestDownloadTokenHash?: string;
    clientIdempotencyKey?: string;
    currency: string;
    subtotalCents?: number;
    discountCents?: number;
    taxCents?: number;
    totalCents?: number;
    state?: CheckoutSessionState;
  }
): Promise<CheckoutSessionRow> {
  const result = await pool.query<CheckoutSessionRow>(
    `insert into checkout_sessions
      (
        identity_key,
        user_id,
        guest_email,
        guest_secret_hash,
        guest_download_token_hash,
        client_idempotency_key,
        currency,
        subtotal_cents,
        discount_cents,
        tax_cents,
        total_cents,
        state
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      returning *`,
    [
      input.identityKey,
      input.userId ?? null,
      input.guestEmail ?? null,
      input.guestSecretHash ?? null,
      input.guestDownloadTokenHash ?? null,
      input.clientIdempotencyKey ?? null,
      input.currency,
      input.subtotalCents ?? 0,
      input.discountCents ?? 0,
      input.taxCents ?? 0,
      input.totalCents ?? 0,
      input.state ?? "draft"
    ]
  );

  return result.rows[0]!;
}

export async function findByIdentityAndIdempotencyKey(
  pool: Queryable,
  identityKey: string,
  clientIdempotencyKey: string
): Promise<CheckoutSessionRow | null> {
  const result = await pool.query<CheckoutSessionRow>(
    `select *
      from checkout_sessions
      where identity_key = $1
        and client_idempotency_key = $2`,
    [identityKey, clientIdempotencyKey]
  );

  return result.rows[0] ?? null;
}

export async function findById(
  pool: Queryable,
  checkoutSessionId: string
): Promise<CheckoutSessionRow | null> {
  const result = await pool.query<CheckoutSessionRow>(
    `select *
      from checkout_sessions
      where id = $1`,
    [checkoutSessionId]
  );

  return result.rows[0] ?? null;
}

export async function findByIdForUser(
  pool: Queryable,
  checkoutSessionId: string,
  userId: string
): Promise<CheckoutSessionRow | null> {
  const result = await pool.query<CheckoutSessionRow>(
    `select *
      from checkout_sessions
      where id = $1
        and user_id = $2`,
    [checkoutSessionId, userId]
  );

  return result.rows[0] ?? null;
}

export async function findByIdForGuest(
  pool: Queryable,
  checkoutSessionId: string
): Promise<CheckoutSessionRow | null> {
  const result = await pool.query<CheckoutSessionRow>(
    `select *
      from checkout_sessions
      where id = $1
        and user_id is null`,
    [checkoutSessionId]
  );

  return result.rows[0] ?? null;
}

export async function findByProviderAndProviderSessionId(
  pool: Queryable,
  provider: ProviderType,
  providerSessionId: string
): Promise<CheckoutSessionRow | null> {
  const result = await pool.query<CheckoutSessionRow>(
    `select *
      from checkout_sessions
      where provider = $1
        and provider_session_id = $2`,
    [provider, providerSessionId]
  );

  return result.rows[0] ?? null;
}

export async function countGuestSessionsSince(
  pool: Queryable,
  guestEmail: string,
  since: Date
): Promise<number> {
  const result = await pool.query<{ count: string }>(
    `select count(*)::text as count
      from checkout_sessions
      where guest_email = $1
        and created_at >= $2`,
    [guestEmail, since]
  );

  return Number(result.rows[0]?.count ?? "0");
}

export async function countByIdentitySince(
  pool: Queryable,
  identityKey: string,
  since: Date
): Promise<number> {
  const result = await pool.query<{ count: string }>(
    `select count(*)::text as count
      from checkout_sessions
      where identity_key = $1
        and created_at >= $2`,
    [identityKey, since]
  );

  return Number(result.rows[0]?.count ?? "0");
}

export async function markStarted(
  pool: Queryable,
  input: {
    checkoutSessionId: string;
    provider: ProviderType;
    providerSessionId: string;
    redirectUrl: string;
    expiresAt?: Date;
  }
): Promise<CheckoutSessionRow | null> {
  const result = await pool.query<CheckoutSessionRow>(
    `update checkout_sessions
      set provider = $2,
          provider_session_id = $3,
          provider_checkout_url = $4,
          started_at = current_timestamp,
          expires_at = $5,
          state = 'started',
          updated_at = current_timestamp
      where id = $1
      returning *`,
    [
      input.checkoutSessionId,
      input.provider,
      input.providerSessionId,
      input.redirectUrl,
      input.expiresAt ?? null
    ]
  );

  return result.rows[0] ?? null;
}

export async function markCompleted(
  pool: Queryable,
  checkoutSessionId: string
): Promise<CheckoutSessionRow | null> {
  const result = await pool.query<CheckoutSessionRow>(
    `update checkout_sessions
      set state = 'completed',
          completed_at = current_timestamp,
          updated_at = current_timestamp
      where id = $1
      returning *`,
    [checkoutSessionId]
  );

  return result.rows[0] ?? null;
}

export async function markExpired(
  pool: Queryable,
  checkoutSessionId: string
): Promise<CheckoutSessionRow | null> {
  const result = await pool.query<CheckoutSessionRow>(
    `update checkout_sessions
      set state = 'expired',
          updated_at = current_timestamp
      where id = $1
      returning *`,
    [checkoutSessionId]
  );

  return result.rows[0] ?? null;
}

export async function markCanceled(
  pool: Queryable,
  checkoutSessionId: string
): Promise<CheckoutSessionRow | null> {
  const result = await pool.query<CheckoutSessionRow>(
    `update checkout_sessions
      set state = 'canceled',
          updated_at = current_timestamp
      where id = $1
      returning *`,
    [checkoutSessionId]
  );

  return result.rows[0] ?? null;
}
