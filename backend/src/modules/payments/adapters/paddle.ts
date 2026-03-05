import { HttpError } from "../../../lib/http/exceptions.js";
import type { Env } from "../../../config/env.js";
import type { StartCheckoutInput, StartCheckoutResult } from "./types.js";

function getPaddleBaseUrl(environment: Env["PADDLE_ENVIRONMENT"]): string {
  return environment === "production" ? "https://api.paddle.com" : "https://sandbox-api.paddle.com";
}

export async function startPaddleCheckout(
  env: Env,
  input: StartCheckoutInput
): Promise<StartCheckoutResult> {
  const response = await fetch(`${getPaddleBaseUrl(env.PADDLE_ENVIRONMENT)}/transactions`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.PADDLE_API_KEY}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      items: input.items.map((item) => ({
        quantity: item.quantity,
        price: {
          description: item.title,
          name: item.title,
          product_id: item.productId,
          unit_price: {
            amount: String(item.unitAmountCents),
            currency_code: input.currency
          }
        }
      })),
      custom_data: {
        checkout_session_id: input.checkoutSessionId,
        order_id: input.orderId,
        identity_key: input.identityKey,
        ...(input.customer.userId ? { user_id: input.customer.userId } : {})
      },
      customer_email: input.customer.email,
      checkout: {
        success_url: input.successUrl,
        cancel_url: input.cancelUrl
      }
    })
  });

  if (!response.ok) {
    throw new HttpError(502, "PADDLE_START_FAILED", "Paddle checkout creation failed");
  }

  const payload = (await response.json()) as {
    data?: {
      id?: string;
      checkout?: {
        url?: string;
      };
      expires_at?: string;
    };
  };

  const transaction = payload.data;

  if (!transaction?.id || !transaction.checkout?.url) {
    throw new HttpError(502, "PADDLE_START_INVALID", "Paddle checkout response was incomplete");
  }

  return {
    provider: "paddle",
    providerSessionId: transaction.id,
    redirectUrl: transaction.checkout.url,
    ...(transaction.expires_at ? { expiresAt: transaction.expires_at } : {})
  };
}
