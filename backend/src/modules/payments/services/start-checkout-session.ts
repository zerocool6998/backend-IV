import type { FastifyRequest } from "fastify";
import { findByIdForGuest, findByIdForUser, markStarted } from "../../../db/repositories/checkout-sessions.js";
import { listItemsForSession } from "../../../db/repositories/checkout-session-items.js";
import { findProductsByIds } from "./support.js";
import { appendAuditLog } from "../../../db/repositories/audit-logs.js";
import { createOrderFromCheckoutSession, findByCheckoutSessionId } from "../../../db/repositories/orders.js";
import { startCheckoutWithProvider } from "../adapters/index.js";
import { verifySecretDigest } from "../../../lib/crypto/index.js";
import { HttpError } from "../../../lib/http/exceptions.js";
import { getEnv } from "../../../config/env.js";
import { resolveOptionalAuthUser } from "./create-checkout-session.js";
import type { ProviderType } from "../../../db/types.js";

type StartCheckoutBody = {
  provider: ProviderType;
  guestSecret?: string;
};

function buildCheckoutUrl(baseUrl: string, path: string): string {
  return new URL(path, baseUrl).toString();
}

export async function startCheckoutSession(
  request: FastifyRequest<{ Params: { id: string }; Body: StartCheckoutBody }>
): Promise<{
  checkoutSession: {
    id: string;
    state: string;
    provider: ProviderType;
    redirectUrl: string;
    orderId: string;
  };
}> {
  const userId = await resolveOptionalAuthUser(request);
  const { provider, guestSecret } = request.body;
  const checkoutSessionId = request.params.id;

  let session = userId
    ? await findByIdForUser(request.server.db, checkoutSessionId, userId)
    : await findByIdForGuest(request.server.db, checkoutSessionId);

  if (!session) {
    throw new HttpError(404, "CHECKOUT_NOT_FOUND", "Checkout session not found");
  }

  if (session.user_id) {
    if (!userId) {
      throw new HttpError(404, "CHECKOUT_NOT_FOUND", "Checkout session not found");
    }

    if (guestSecret) {
      throw new HttpError(400, "CHECKOUT_GUEST_SECRET_INVALID", "guestSecret is not allowed for authenticated checkout");
    }
  } else {
    if (!guestSecret || !session.guest_secret_hash) {
      throw new HttpError(404, "CHECKOUT_NOT_FOUND", "Checkout session not found");
    }

    const isValidGuestSecret = verifySecretDigest(
      guestSecret,
      session.guest_secret_hash,
      getEnv().GUEST_SECRET_HMAC_KEY
    );

    if (!isValidGuestSecret) {
      throw new HttpError(404, "CHECKOUT_NOT_FOUND", "Checkout session not found");
    }
  }

  const existingOrder = await findByCheckoutSessionId(request.server.db, session.id);

  if (session.state === "started") {
    if (session.provider === provider && session.provider_checkout_url && existingOrder) {
      return {
        checkoutSession: {
          id: session.id,
          state: session.state,
          provider,
          redirectUrl: session.provider_checkout_url,
          orderId: existingOrder.id
        }
      };
    }

    throw new HttpError(409, "CHECKOUT_ALREADY_STARTED", "Checkout session has already been started");
  }

  if (session.state === "completed" || session.state === "expired" || session.state === "canceled") {
    throw new HttpError(409, "CHECKOUT_STATE_CONFLICT", "Checkout session is no longer startable");
  }

  const items = await listItemsForSession(request.server.db, session.id);
  const products = await findProductsByIds(
    request.server.db,
    items.map((item) => item.product_id)
  );
  const productMap = new Map(products.map((product) => [product.id, product]));

  const order =
    existingOrder ??
    (await createOrderFromCheckoutSession(request.server.db, {
      identityKey: session.identity_key,
      ...(session.user_id ? { userId: session.user_id } : {}),
      ...(session.guest_email ? { guestEmail: session.guest_email } : {}),
      checkoutSessionId: session.id,
      currency: session.currency,
      subtotalCents: session.subtotal_cents,
      discountCents: session.discount_cents,
      taxCents: session.tax_cents,
      totalCents: session.total_cents,
      status: "pending"
    }));

  const env = getEnv();
  const adapterResult = await startCheckoutWithProvider(provider, {
    checkoutSessionId: session.id,
    orderId: order.id,
    correlationId: session.id,
    identityKey: session.identity_key,
    currency: session.currency,
    totalCents: session.total_cents,
    items: items.map((item) => {
      const product = productMap.get(item.product_id);

      if (!product) {
        throw new HttpError(400, "CHECKOUT_INVALID_PRODUCTS", "One or more products are unavailable");
      }

      return {
        productId: item.product_id,
        title: product.title,
        unitAmountCents: item.unit_amount_cents,
        quantity: item.quantity
      };
    }),
    customer: {
      userId: session.user_id,
      email: session.guest_email
    },
    successUrl: buildCheckoutUrl(env.FRONTEND_BASE_URL, env.CHECKOUT_SUCCESS_PATH),
    cancelUrl: buildCheckoutUrl(env.FRONTEND_BASE_URL, env.CHECKOUT_CANCEL_PATH)
  });

  session =
    (await markStarted(request.server.db, {
      checkoutSessionId: session.id,
      provider,
      providerSessionId: adapterResult.providerSessionId,
      redirectUrl: adapterResult.redirectUrl,
      ...(adapterResult.expiresAt ? { expiresAt: new Date(adapterResult.expiresAt) } : {})
    })) ?? session;

  await appendAuditLog(request.server.db, {
    entityType: "checkout_session",
    entityId: session.id,
    action: "checkout_started",
    metadata: {
      provider,
      checkoutSessionId: session.id,
      orderId: order.id,
      transition: "created_to_started"
    }
  });

  return {
    checkoutSession: {
      id: session.id,
      state: session.state,
      provider,
      redirectUrl: session.provider_checkout_url ?? adapterResult.redirectUrl,
      orderId: order.id
    }
  };
}
