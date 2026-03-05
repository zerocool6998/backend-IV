import { createSha256Hmac, safeHexCompare } from "../../../lib/crypto/index.js";
import { HttpError } from "../../../lib/http/exceptions.js";
import type { Env } from "../../../config/env.js";
import type { NormalizedWebhookEvent } from "./types.js";

function parsePaddleSignature(signatureHeader: string): { timestamp: string; signature: string } {
  const parts = signatureHeader.split(";").map((part) => part.trim());
  const timestamp = parts.find((part) => part.startsWith("ts="))?.slice(3);
  const signature = parts.find((part) => part.startsWith("h1="))?.slice(3);

  if (!timestamp || !signature) {
    throw new HttpError(400, "WEBHOOK_INVALID_SIGNATURE", "Invalid Paddle signature");
  }

  return { timestamp, signature };
}

export function verifyPaddleWebhookSignature(
  env: Env,
  rawBody: string,
  signatureHeader: string | undefined
): void {
  if (!signatureHeader) {
    throw new HttpError(400, "WEBHOOK_INVALID_SIGNATURE", "Missing Paddle signature");
  }

  const { timestamp, signature } = parsePaddleSignature(signatureHeader);
  const expected = createSha256Hmac(env.PADDLE_WEBHOOK_SECRET, `${timestamp}:${rawBody}`);

  if (!safeHexCompare(expected, signature)) {
    throw new HttpError(400, "WEBHOOK_INVALID_SIGNATURE", "Invalid Paddle signature");
  }
}

function toStringId(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export function normalizePaddleWebhook(payload: Record<string, unknown>): NormalizedWebhookEvent {
  const data = (payload.data as Record<string, unknown> | undefined) ?? {};
  const customData = (data.custom_data as Record<string, unknown> | undefined) ?? {};
  const eventType = typeof payload.event_type === "string" ? payload.event_type : "unsupported";
  const transitions: Record<string, NormalizedWebhookEvent["transition"]> = {
    "transaction.paid": "payment_succeeded",
    "transaction.payment_failed": "payment_failed",
    "transaction.canceled": "checkout_canceled",
    "adjustment.updated": "payment_refunded"
  };

  const transition = transitions[eventType] ?? "unsupported";

  return {
    provider: "paddle",
    providerEventId: toStringId(payload.event_id),
    eventType,
    transition,
    correlationId:
      typeof customData.checkout_session_id === "string" ? customData.checkout_session_id : null,
    providerSessionId: typeof data.id === "string" ? data.id : null,
    providerPaymentId: typeof data.id === "string" ? data.id : null,
    ...(typeof payload.occurred_at === "string" ? { occurredAt: payload.occurred_at } : {}),
    payload,
    ...(transition === "unsupported" ? { ignoreReason: "unsupported_event_type" } : {})
  };
}
