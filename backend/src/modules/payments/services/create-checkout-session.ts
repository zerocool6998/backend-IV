import type { FastifyRequest } from "fastify";
import { createCheckoutSessionHeader, countByIdentitySince, countGuestSessionsSince, findByIdentityAndIdempotencyKey } from "../../../db/repositories/checkout-sessions.js";
import { addItem, listItemsForSession } from "../../../db/repositories/checkout-session-items.js";
import { findActiveProductsByIds } from "../../../db/repositories/products.js";
import { getEnv } from "../../../config/env.js";
import { createSecretDigest, generateOpaqueSecret } from "../../../lib/crypto/index.js";
import { HttpError } from "../../../lib/http/exceptions.js";

type CreateCheckoutBody = {
  currency: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  guestEmail?: string;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function mergeItems(items: CreateCheckoutBody["items"]): Map<string, number> {
  const merged = new Map<string, number>();

  for (const item of items) {
    if (item.quantity <= 0) {
      throw new HttpError(400, "CHECKOUT_INVALID_QUANTITY", "Item quantity must be positive");
    }

    merged.set(item.productId, (merged.get(item.productId) ?? 0) + item.quantity);
  }

  return merged;
}

export async function resolveOptionalAuthUser(request: FastifyRequest): Promise<string | null> {
  const authorization = request.headers.authorization;

  if (!authorization) {
    return null;
  }

  try {
    await request.jwtVerify();
  } catch {
    throw new HttpError(401, "AUTH_INVALID_TOKEN", "Invalid authorization token");
  }

  return request.user.sub;
}

export async function createCheckoutSession(
  request: FastifyRequest<{ Body: CreateCheckoutBody }>
): Promise<{
  wasCreated: boolean;
  data: {
    checkoutSession: {
      id: string;
      state: string;
      currency: string;
      subtotalCents: number;
      discountCents: number;
      taxCents: number;
      totalCents: number;
      items: Array<{
        productId: string;
        quantity: number;
        unitAmountCents: number;
      }>;
    };
    guestSecret?: string;
  };
}> {
  const idempotencyKey = request.headers["idempotency-key"];

  if (typeof idempotencyKey !== "string" || idempotencyKey.trim().length === 0) {
    throw new HttpError(400, "CHECKOUT_IDEMPOTENCY_REQUIRED", "Idempotency-Key header is required");
  }

  const userId = await resolveOptionalAuthUser(request);
  const { currency, items, guestEmail } = request.body;

  if (items.length === 0) {
    throw new HttpError(400, "CHECKOUT_EMPTY", "Checkout sessions require at least one item");
  }

  const normalizedGuestEmail = guestEmail ? normalizeEmail(guestEmail) : undefined;

  if (userId && normalizedGuestEmail) {
    throw new HttpError(400, "CHECKOUT_GUEST_CONFLICT", "Authenticated checkout cannot include guestEmail");
  }

  if (!userId && !normalizedGuestEmail) {
    throw new HttpError(400, "CHECKOUT_GUEST_EMAIL_REQUIRED", "guestEmail is required for guest checkout");
  }

  const identityKey = userId ? `u:${userId}` : `e:${normalizedGuestEmail!}`;

  const existingSession = await findByIdentityAndIdempotencyKey(request.server.db, identityKey, idempotencyKey);

  if (existingSession) {
    const existingItems = await listItemsForSession(request.server.db, existingSession.id);

    return {
      wasCreated: false,
      data: {
        checkoutSession: {
          id: existingSession.id,
          state: existingSession.state,
          currency: existingSession.currency,
          subtotalCents: existingSession.subtotal_cents,
          discountCents: existingSession.discount_cents,
          taxCents: existingSession.tax_cents,
          totalCents: existingSession.total_cents,
          items: existingItems.map((item) => ({
            productId: item.product_id,
            quantity: item.quantity,
            unitAmountCents: item.unit_amount_cents
          }))
        }
      }
    };
  }

  const now = new Date();
  const oneMinuteAgo = new Date(now.getTime() - 60_000);
  const oneDayAgo = new Date(now.getTime() - 86_400_000);

  if (userId) {
    const userRecentCount = await countByIdentitySince(request.server.db, identityKey, oneMinuteAgo);

    if (userRecentCount >= 20) {
      throw new HttpError(429, "CHECKOUT_RATE_LIMITED", "Too many checkout sessions created recently");
    }
  } else {
    const minuteCount = await countGuestSessionsSince(request.server.db, normalizedGuestEmail!, oneMinuteAgo);
    const dayCount = await countGuestSessionsSince(request.server.db, normalizedGuestEmail!, oneDayAgo);

    if (minuteCount >= 5 || dayCount >= 20) {
      throw new HttpError(429, "CHECKOUT_RATE_LIMITED", "Guest checkout limit reached");
    }
  }

  const mergedItems = mergeItems(items);
  const productIds = [...mergedItems.keys()];
  const products = await findActiveProductsByIds(request.server.db, productIds);

  if (products.length !== productIds.length) {
    throw new HttpError(400, "CHECKOUT_INVALID_PRODUCTS", "One or more products are unavailable");
  }

  if (products.some((product) => product.currency !== currency)) {
    throw new HttpError(400, "CHECKOUT_CURRENCY_MISMATCH", "All products must match the requested currency");
  }

  const productMap = new Map(products.map((product) => [product.id, product]));
  const pricedItems = productIds.map((productId) => {
    const product = productMap.get(productId);

    if (!product) {
      throw new HttpError(400, "CHECKOUT_INVALID_PRODUCTS", "One or more products are unavailable");
    }

    const quantity = mergedItems.get(productId)!;

    return {
      product,
      quantity
    };
  });

  const subtotalCents = pricedItems.reduce(
    (total, item) => total + item.product.price_cents * item.quantity,
    0
  );

  const guestSecret = userId ? undefined : generateOpaqueSecret();
  const guestSecretHash = guestSecret
    ? createSecretDigest(guestSecret, getEnv().GUEST_SECRET_HMAC_KEY)
    : undefined;
  const guestDownloadTokenHash = guestSecret
    ? createSecretDigest(guestSecret, getEnv().DOWNLOAD_TOKEN_HMAC_KEY)
    : undefined;

  const session = await createCheckoutSessionHeader(request.server.db, {
    identityKey,
    ...(userId ? { userId } : {}),
    ...(normalizedGuestEmail ? { guestEmail: normalizedGuestEmail } : {}),
    ...(guestSecretHash ? { guestSecretHash } : {}),
    ...(guestDownloadTokenHash ? { guestDownloadTokenHash } : {}),
    clientIdempotencyKey: idempotencyKey,
    currency,
    subtotalCents,
    discountCents: 0,
    taxCents: 0,
    totalCents: subtotalCents,
    state: "created"
  });

  for (const item of pricedItems) {
    await addItem(request.server.db, {
      checkoutSessionId: session.id,
      productId: item.product.id,
      quantity: item.quantity,
      unitAmountCents: item.product.price_cents
    });
  }

  return {
    wasCreated: true,
    data: {
      checkoutSession: {
        id: session.id,
        state: session.state,
        currency: session.currency,
        subtotalCents: session.subtotal_cents,
        discountCents: session.discount_cents,
        taxCents: session.tax_cents,
        totalCents: session.total_cents,
        items: pricedItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          unitAmountCents: item.product.price_cents
        }))
      },
      ...(guestSecret ? { guestSecret } : {})
    }
  };
}
