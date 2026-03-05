import type { Pool } from "pg";
import type { PaymentRow, PaymentStatus, ProviderType } from "../types.js";

type Queryable = Pick<Pool, "query">;

export async function insertPayment(
  pool: Queryable,
  input: {
    orderId: string;
    provider: ProviderType;
    providerPaymentId: string;
    providerSessionId?: string;
    status: PaymentStatus;
    amountCents: number;
    currency: string;
  }
): Promise<PaymentRow> {
  const result = await pool.query<PaymentRow>(
    `insert into payments
      (
        order_id,
        provider,
        provider_payment_id,
        provider_session_id,
        status,
        amount_cents,
        currency
      )
      values ($1, $2, $3, $4, $5, $6, $7)
      returning *`,
    [
      input.orderId,
      input.provider,
      input.providerPaymentId,
      input.providerSessionId ?? null,
      input.status,
      input.amountCents,
      input.currency
    ]
  );

  return result.rows[0]!;
}

export async function findByProviderPaymentId(
  pool: Queryable,
  provider: ProviderType,
  providerPaymentId: string
): Promise<PaymentRow | null> {
  const result = await pool.query<PaymentRow>(
    `select *
      from payments
      where provider = $1
        and provider_payment_id = $2`,
    [provider, providerPaymentId]
  );

  return result.rows[0] ?? null;
}

export async function findByOrderId(pool: Queryable, orderId: string): Promise<PaymentRow | null> {
  const result = await pool.query<PaymentRow>(
    `select *
      from payments
      where order_id = $1
      order by created_at desc
      limit 1`,
    [orderId]
  );

  return result.rows[0] ?? null;
}

export async function markPaymentStatus(
  pool: Queryable,
  paymentId: string,
  status: PaymentStatus
): Promise<PaymentRow | null> {
  const result = await pool.query<PaymentRow>(
    `update payments
      set status = $2,
          updated_at = current_timestamp
      where id = $1
      returning *`,
    [paymentId, status]
  );

  return result.rows[0] ?? null;
}
