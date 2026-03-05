import type { Env } from "../../../config/env.js";
import { normalizePaddleWebhook, verifyPaddleWebhookSignature } from "../adapters/paddle.js";
import { normalizeStripeWebhook, verifyStripeWebhookSignature } from "../adapters/stripe.js";
import type { NormalizedWebhookEvent } from "../adapters/types.js";

export function verifyAndNormalizeWebhook(
  env: Env,
  provider: "stripe" | "paddle",
  rawBody: string,
  signatureHeader: string | undefined
): NormalizedWebhookEvent {
  const payload = JSON.parse(rawBody) as Record<string, unknown>;

  if (provider === "stripe") {
    verifyStripeWebhookSignature(env, rawBody, signatureHeader);
    return normalizeStripeWebhook(payload);
  }

  verifyPaddleWebhookSignature(env, rawBody, signatureHeader);
  return normalizePaddleWebhook(payload);
}
