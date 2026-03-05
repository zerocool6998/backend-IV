import type { ProviderType } from "../../../db/types.js";

export type WebhookTransition =
  | "payment_succeeded"
  | "payment_failed"
  | "checkout_expired"
  | "checkout_canceled"
  | "payment_refunded"
  | "payment_disputed"
  | "unsupported";

export type NormalizedWebhookEvent = {
  provider: ProviderType;
  providerEventId: string;
  eventType: string;
  transition: WebhookTransition;
  correlationId: string | null;
  providerSessionId: string | null;
  providerPaymentId: string | null;
  occurredAt?: string;
  payload: unknown;
  ignoreReason?: string;
};
