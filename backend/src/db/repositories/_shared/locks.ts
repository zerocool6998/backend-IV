import type { PoolClient } from "pg";
import type {
  CheckoutSessionRow,
  OrderRow,
  PaymentRow,
  ProviderType,
  WebhookEventRow
} from "../../types.js";

export async function lockWebhookEventByProviderAndEventId(
  client: PoolClient,
  provider: ProviderType,
  providerEventId: string
): Promise<WebhookEventRow | null> {
  const result = await client.query<WebhookEventRow>(
    `select *
      from webhook_events
      where provider = $1
        and provider_event_id = $2
      for update`,
    [provider, providerEventId]
  );

  return result.rows[0] ?? null;
}

export async function lockCheckoutSessionById(
  client: PoolClient,
  checkoutSessionId: string
): Promise<CheckoutSessionRow | null> {
  const result = await client.query<CheckoutSessionRow>(
    `select *
      from checkout_sessions
      where id = $1
      for update`,
    [checkoutSessionId]
  );

  return result.rows[0] ?? null;
}

export async function lockOrderById(client: PoolClient, orderId: string): Promise<OrderRow | null> {
  const result = await client.query<OrderRow>(
    `select *
      from orders
      where id = $1
      for update`,
    [orderId]
  );

  return result.rows[0] ?? null;
}

export async function lockPaymentByProviderAndPaymentId(
  client: PoolClient,
  provider: ProviderType,
  providerPaymentId: string
): Promise<PaymentRow | null> {
  const result = await client.query<PaymentRow>(
    `select *
      from payments
      where provider = $1
        and provider_payment_id = $2
      for update`,
    [provider, providerPaymentId]
  );

  return result.rows[0] ?? null;
}
