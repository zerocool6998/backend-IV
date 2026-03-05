import { createSha256Hmac, safeHexCompare } from "../../../lib/crypto/index.js";
import { HttpError } from "../../../lib/http/exceptions.js";
import type { Env } from "../../../config/env.js";
import type { NormalizedWebhookEvent } from "./types.js";

function parseStripeSignature(signatureHeader: string): { timestamp: string; signature: string } {
  const parts = signatureHeader.split(",").map((part) => part.trim());
  const timestamp = parts.find((part) => part.startsWith("t="))?.slice(2);
  const signature = parts.find((part) => part.startsWith("v1="))?.slice(3);

  if (!timestamp || !signature) {
    throw new HttpError(400, "WEBHOOK_INVALID_SIGNATURE", "Invalid Stripe signature");
  }

  return { timestamp, signature };
}

export function verifyStripeWebhookSignature(
  env: Env,
  rawBody: string,
  signatureHeader: string | undefined
): void {
  if (!signatureHeader) {
    throw new HttpError(400, "WEBHOOK_INVALID_SIGNATURE", "Missing Stripe signature");
  }

  const { timestamp, signature } = parseStripeSignature(signatureHeader);
  const expected = createSha256Hmac(env.STRIPE_WEBHOOK_SECRET, `${timestamp}.${rawBody}`);

  if (!safeHexCompare(expected, signature)) {
    throw new HttpError(400, "WEBHOOK_INVALID_SIGNATURE", "Invalid Stripe signature");
  }
}

function toStringId(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export function normalizeStripeWebhook(payload: Record<string, unknown>): NormalizedWebhookEvent {
  const dataObject = (payload.data as { object?: Record<string, unknown> } | undefined)?.object ?? {};
  const metadata = (dataObject.metadata as Record<string, unknown> | undefined) ?? {};
  const eventType = typeof payload.type === "string" ? payload.type : "unsupported";

  const transitions: Record<string, NormalizedWebhookEvent["transition"]> = {
    "checkout.session.completed": "payment_succeeded",
    "checkout.session.expired": "checkout_expired",
    "checkout.session.async_payment_failed": "payment_failed",
    "charge.dispute.created": "payment_disputed",
    "charge.refunded": "payment_refunded"
  };

  const transition = transitions[eventType] ?? "unsupported";
  const providerSessionId =
    eventType.startsWith("checkout.session.") && typeof dataObject.id === "string" ? dataObject.id : null;

  return {
    provider: "stripe",
    providerEventId: toStringId(payload.id),
    eventType,
    transition,
    correlationId:
      typeof metadata.checkout_session_id === "string" ? metadata.checkout_session_id : null,
    providerSessionId,
    providerPaymentId:
      typeof dataObject.payment_intent === "string"
        ? dataObject.payment_intent
        : typeof dataObject.charge === "string"
          ? dataObject.charge
          : null,
    ...(typeof payload.created === "number"
      ? { occurredAt: new Date(payload.created * 1000).toISOString() }
      : {}),
    payload,
    ...(transition === "unsupported" ? { ignoreReason: "unsupported_event_type" } : {})
  };
}
