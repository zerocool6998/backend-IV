import { HttpError } from "../../../lib/http/exceptions.js";
import type { Env } from "../../../config/env.js";
import type { StartCheckoutInput, StartCheckoutResult } from "./types.js";

function appendLineItemFields(params: URLSearchParams, input: StartCheckoutInput): void {
  input.items.forEach((item, index) => {
    params.append(`line_items[${index}][price_data][currency]`, input.currency.toLowerCase());
    params.append(`line_items[${index}][price_data][unit_amount]`, String(item.unitAmountCents));
    params.append(`line_items[${index}][price_data][product_data][name]`, item.title);
    params.append(`line_items[${index}][quantity]`, String(item.quantity));
  });
}

export async function startStripeCheckout(
  env: Env,
  input: StartCheckoutInput
): Promise<StartCheckoutResult> {
  const params = new URLSearchParams();
  params.append("mode", "payment");
  params.append("success_url", input.successUrl);
  params.append("cancel_url", input.cancelUrl);
  params.append("metadata[checkout_session_id]", input.checkoutSessionId);
  params.append("metadata[order_id]", input.orderId);
  params.append("metadata[identity_key]", input.identityKey);

  if (input.customer.userId) {
    params.append("metadata[user_id]", input.customer.userId);
  }

  if (input.customer.email) {
    params.append("customer_email", input.customer.email);
  }

  appendLineItemFields(params, input);

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      "content-type": "application/x-www-form-urlencoded"
    },
    body: params.toString()
  });

  if (!response.ok) {
    throw new HttpError(502, "STRIPE_START_FAILED", "Stripe checkout session creation failed");
  }

  const payload = (await response.json()) as {
    id?: string;
    url?: string;
    expires_at?: number;
  };

  if (!payload.id || !payload.url) {
    throw new HttpError(502, "STRIPE_START_INVALID", "Stripe checkout response was incomplete");
  }

  return {
    provider: "stripe",
    providerSessionId: payload.id,
    redirectUrl: payload.url,
    ...(payload.expires_at
      ? { expiresAt: new Date(payload.expires_at * 1000).toISOString() }
      : {})
  };
}
