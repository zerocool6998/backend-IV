import { describe, expect, it } from "vitest";
import { createSha256Hmac } from "../../../lib/crypto/index.js";
import { normalizePaddleWebhook, verifyPaddleWebhookSignature } from "./paddle.js";
import { normalizeStripeWebhook, verifyStripeWebhookSignature } from "./stripe.js";

describe("webhook adapters", () => {
  it("verifies and normalizes Stripe webhook payloads", () => {
    const payload = JSON.stringify({
      id: "evt_123",
      type: "checkout.session.completed",
      created: 1772559999,
      data: {
        object: {
          id: "cs_test_123",
          payment_intent: "pi_123",
          metadata: {
            checkout_session_id: "cs-1"
          }
        }
      }
    });
    const timestamp = "1772559999";
    const signature = createSha256Hmac("whsec_test_123", `${timestamp}.${payload}`);

    expect(() =>
      verifyStripeWebhookSignature(
        {
          STRIPE_WEBHOOK_SECRET: "whsec_test_123"
        } as never,
        payload,
        `t=${timestamp},v1=${signature}`
      )
    ).not.toThrow();

    const normalized = normalizeStripeWebhook(JSON.parse(payload) as Record<string, unknown>);
    expect(normalized).toMatchObject({
      provider: "stripe",
      providerEventId: "evt_123",
      transition: "payment_succeeded",
      correlationId: "cs-1",
      providerSessionId: "cs_test_123",
      providerPaymentId: "pi_123"
    });
  });

  it("verifies and normalizes Paddle webhook payloads", () => {
    const payload = JSON.stringify({
      event_id: "pdl_evt_1",
      event_type: "transaction.paid",
      occurred_at: "2026-03-03T00:00:00.000Z",
      data: {
        id: "txn_123",
        checkout: {
          id: "paddle_checkout_1"
        },
        custom_data: {
          checkout_session_id: "cs-1"
        }
      }
    });
    const timestamp = "1772559999";
    const signature = createSha256Hmac("paddle_secret_123", `${timestamp}:${payload}`);

    expect(() =>
      verifyPaddleWebhookSignature(
        {
          PADDLE_WEBHOOK_SECRET: "paddle_secret_123"
        } as never,
        payload,
        `ts=${timestamp};h1=${signature}`
      )
    ).not.toThrow();

    const normalized = normalizePaddleWebhook(JSON.parse(payload) as Record<string, unknown>);
    expect(normalized).toMatchObject({
      provider: "paddle",
      providerEventId: "pdl_evt_1",
      transition: "payment_succeeded",
      correlationId: "cs-1",
      providerSessionId: "txn_123",
      providerPaymentId: "txn_123"
    });
  });
});
