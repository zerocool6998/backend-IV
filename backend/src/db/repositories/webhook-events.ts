import type { Pool } from "pg";
import type { ProviderType, WebhookEventRow } from "../types.js";

type Queryable = Pick<Pool, "query">;

export async function insertWebhookEvent(
  pool: Queryable,
  input: {
    provider: ProviderType;
    providerEventId: string;
    eventType: string;
    correlationId?: string;
    providerCreatedAt?: Date;
    payload: unknown;
  }
): Promise<WebhookEventRow | null> {
  const result = await pool.query<WebhookEventRow>(
    `insert into webhook_events
      (provider, provider_event_id, event_type, correlation_id, provider_created_at, payload)
      values ($1, $2, $3, $4, $5, $6)
      on conflict (provider, provider_event_id) do nothing
      returning *`,
    [
      input.provider,
      input.providerEventId,
      input.eventType,
      input.correlationId ?? null,
      input.providerCreatedAt ?? null,
      JSON.stringify(input.payload)
    ]
  );

  return result.rows[0] ?? null;
}

export async function findByProviderAndEventId(
  pool: Queryable,
  provider: ProviderType,
  providerEventId: string
): Promise<WebhookEventRow | null> {
  const result = await pool.query<WebhookEventRow>(
    `select *
      from webhook_events
      where provider = $1
        and provider_event_id = $2`,
    [provider, providerEventId]
  );

  return result.rows[0] ?? null;
}

export async function markProcessed(
  pool: Queryable,
  webhookEventId: string,
  processingResult: Record<string, unknown>
): Promise<WebhookEventRow | null> {
  const result = await pool.query<WebhookEventRow>(
    `update webhook_events
      set status = 'processed',
          processed_at = current_timestamp,
          processing_result = $2,
          last_error = null
      where id = $1
      returning *`,
    [webhookEventId, JSON.stringify(processingResult)]
  );

  return result.rows[0] ?? null;
}

export async function markIgnored(
  pool: Queryable,
  webhookEventId: string,
  processingResult: Record<string, unknown>
): Promise<WebhookEventRow | null> {
  const result = await pool.query<WebhookEventRow>(
    `update webhook_events
      set status = 'ignored',
          processed_at = current_timestamp,
          processing_result = $2,
          last_error = null
      where id = $1
      returning *`,
    [webhookEventId, JSON.stringify(processingResult)]
  );

  return result.rows[0] ?? null;
}

export async function markFailed(
  pool: Queryable,
  webhookEventId: string,
  lastError: string,
  processingResult: Record<string, unknown> = {}
): Promise<WebhookEventRow | null> {
  const result = await pool.query<WebhookEventRow>(
    `update webhook_events
      set status = 'failed',
          last_error = $2,
          processing_result = $3
      where id = $1
      returning *`,
    [webhookEventId, lastError, JSON.stringify(processingResult)]
  );

  return result.rows[0] ?? null;
}
