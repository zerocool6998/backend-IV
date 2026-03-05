import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { getEnv } from "../../config/env.js";
import { listProductIdsForOrder } from "../../db/repositories/checkout-session-items.js";
import {
  acquireDownloadRateLimitLock,
  countRecentIssuedByIdentityAndProduct,
  insertDownloadLinkEvent
} from "../../db/repositories/download-link-events.js";
import { findByTokenHash } from "../../db/repositories/download-tokens.js";
import {
  findActiveEntitlementByUserAndProduct,
  listEntitlementsForUser
} from "../../db/repositories/entitlements.js";
import { findById as findOrderById } from "../../db/repositories/orders.js";
import { findByProductId, findByProductIdAndKind } from "../../db/repositories/product-files.js";
import { findProductById, listFormatsForProduct } from "../../db/repositories/products.js";
import { withTransaction } from "../../db/repositories/_shared/transaction.js";
import { createSecretDigest } from "../../lib/crypto/index.js";
import { HttpError } from "../../lib/http/exceptions.js";
import { formatSuccessResponse } from "../../lib/http/response.js";
import {
  authenticatedDownloadRateLimitPolicy,
  guestDownloadRateLimitPolicy
} from "../../lib/rate-limit/policies.js";
import { incrementMetric } from "../../lib/metrics/index.js";

type DownloadLinkBody = {
  productId: string;
  format?: string;
};

type GuestDownloadLinkBody = {
  token: string;
  productId: string;
  format?: string;
};

async function resolveProductFile(
  app: FastifyInstance,
  productId: string,
  format?: string
) {
  if (format) {
    const file = await findByProductIdAndKind(app.db, productId, format);

    if (!file) {
      throw new HttpError(404, "PRODUCT_FILE_NOT_FOUND", "Requested format not found");
    }

    return file;
  }

  const files = await findByProductId(app.db, productId);

  if (files.length === 0) {
    throw new HttpError(404, "PRODUCT_FILE_NOT_FOUND", "No downloadable file found");
  }

  if (files.length > 1) {
    throw new HttpError(400, "DOWNLOAD_FORMAT_REQUIRED", "format is required for multi-format products");
  }

  return files[0]!;
}

async function issueSignedDownloadUrl(
  app: FastifyInstance,
  input: {
    identityKey: string;
    userId?: string;
    orderId?: string;
    productId: string;
    productFileId: string;
    storageKey: string;
    channel: "authenticated" | "guest_token";
    requestId: string;
  }
): Promise<{ url: string; expiresAt: string }> {
  const env = getEnv();

  return withTransaction(app.db, async (client) => {
    await acquireDownloadRateLimitLock(client, input.identityKey, input.productId);

    const since = new Date(Date.now() - 60_000);
    const count = await countRecentIssuedByIdentityAndProduct(
      client,
      input.identityKey,
      input.productId,
      since
    );

    if (count >= 5) {
      await insertDownloadLinkEvent(client, {
        ...(input.userId ? { userId: input.userId } : {}),
        ...(input.orderId ? { orderId: input.orderId } : {}),
        identityKey: input.identityKey,
        productId: input.productId,
        productFileId: input.productFileId,
        channel: input.channel,
        outcome: "denied",
        denyReason: "rate_limited",
        requestId: input.requestId
      });
      incrementMetric("download.denied.count", {
        channel: input.channel,
        reason: "rate_limited"
      });
      throw new HttpError(429, "DOWNLOAD_RATE_LIMITED", "Download rate limit exceeded");
    }

    const signed = await app.storage.getSignedGetUrl(input.storageKey, env.DOWNLOAD_URL_TTL_SECONDS);

    await insertDownloadLinkEvent(client, {
      ...(input.userId ? { userId: input.userId } : {}),
      ...(input.orderId ? { orderId: input.orderId } : {}),
      identityKey: input.identityKey,
      productId: input.productId,
      productFileId: input.productFileId,
      channel: input.channel,
      outcome: "issued",
      expiresAt: signed.expiresAt,
      requestId: input.requestId
    });
    incrementMetric("download.issued.count", {
      channel: input.channel
    });

    return {
      url: signed.url,
      expiresAt: signed.expiresAt.toISOString()
    };
  });
}

export const entitlementsRoutes: FastifyPluginAsync = async (app) => {
  app.get("/me/library", { preHandler: app.authenticate }, async (request) => {
    const items = await listEntitlementsForUser(app.db, request.user.sub);

    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        const product = await findProductById(app.db, item.product_id);

        if (!product) {
          return null;
        }

        const availableFormats = await listFormatsForProduct(app.db, item.product_id);

        return {
          productId: product.id,
          slug: product.slug,
          title: product.title,
          priceCents: product.priceCents,
          currency: product.currency,
          availableFormats,
          entitlement: {
            status: item.status,
            firstOrderId: item.first_order_id,
            lastOrderId: item.last_order_id,
            grantedAt: item.granted_at.toISOString(),
            updatedAt: item.updated_at.toISOString()
          }
        };
      })
    );

    return formatSuccessResponse({
      items: enrichedItems.filter((item): item is NonNullable<typeof item> => item !== null)
    });
  });

  app.post<{ Body: DownloadLinkBody }>(
    "/download-link",
    {
      preHandler: app.authenticate,
      config: {
        rateLimit: authenticatedDownloadRateLimitPolicy
      },
      schema: {
        body: {
          type: "object",
          required: ["productId"],
          additionalProperties: false,
          properties: {
            productId: { type: "string", format: "uuid" },
            format: { type: "string", minLength: 1 }
          }
        }
      }
    },
    async (request) => {
      const entitlement = await findActiveEntitlementByUserAndProduct(
        app.db,
        request.user.sub,
        request.body.productId
      );

      if (!entitlement) {
        await insertDownloadLinkEvent(app.db, {
          userId: request.user.sub,
          identityKey: `u:${request.user.sub}`,
          productId: request.body.productId,
          channel: "authenticated",
          outcome: "denied",
          denyReason: "missing_entitlement",
          requestId: request.id
        });
        incrementMetric("download.denied.count", {
          channel: "authenticated",
          reason: "missing_entitlement"
        });
        throw new HttpError(403, "DOWNLOAD_FORBIDDEN", "No active entitlement for this product");
      }

      const file = await resolveProductFile(app, request.body.productId, request.body.format);
      const result = await issueSignedDownloadUrl(app, {
        identityKey: `u:${request.user.sub}`,
        userId: request.user.sub,
        orderId: entitlement.last_order_id,
        productId: request.body.productId,
        productFileId: file.id,
        storageKey: file.storage_key,
        channel: "authenticated",
        requestId: request.id
      });

      return formatSuccessResponse(result);
    }
  );

  app.post<{ Body: GuestDownloadLinkBody }>(
    "/guest/download-link",
    {
      config: {
        rateLimit: guestDownloadRateLimitPolicy
      },
      schema: {
        body: {
          type: "object",
          required: ["token", "productId"],
          additionalProperties: false,
          properties: {
            token: { type: "string", minLength: 16 },
            productId: { type: "string", format: "uuid" },
            format: { type: "string", minLength: 1 }
          }
        }
      }
    },
    async (request) => {
      const tokenHash = createSecretDigest(request.body.token, getEnv().DOWNLOAD_TOKEN_HMAC_KEY);
      const token = await findByTokenHash(app.db, tokenHash);

      if (!token || token.expires_at.getTime() <= Date.now()) {
        await insertDownloadLinkEvent(app.db, {
          identityKey: "guest_token:invalid",
          productId: request.body.productId,
          channel: "guest_token",
          outcome: "denied",
          denyReason: "invalid_token",
          requestId: request.id
        });
        incrementMetric("download.denied.count", {
          channel: "guest_token",
          reason: "invalid_token"
        });
        throw new HttpError(403, "DOWNLOAD_FORBIDDEN", "Invalid or expired download token");
      }

      const order = await findOrderById(app.db, token.order_id);

      if (!order || order.user_id || order.status !== "paid") {
        throw new HttpError(403, "DOWNLOAD_FORBIDDEN", "Download token is not eligible for use");
      }

      const orderProductIds = new Set(await listProductIdsForOrder(app.db, order.id));

      if (!orderProductIds.has(request.body.productId)) {
        await insertDownloadLinkEvent(app.db, {
          orderId: order.id,
          identityKey: order.identity_key,
          productId: request.body.productId,
          channel: "guest_token",
          outcome: "denied",
          denyReason: "product_not_in_order",
          requestId: request.id
        });
        incrementMetric("download.denied.count", {
          channel: "guest_token",
          reason: "product_not_in_order"
        });
        throw new HttpError(403, "DOWNLOAD_FORBIDDEN", "Requested product is not available for this token");
      }

      const file = await resolveProductFile(app, request.body.productId, request.body.format);
      const result = await issueSignedDownloadUrl(app, {
        identityKey: order.identity_key,
        orderId: order.id,
        productId: request.body.productId,
        productFileId: file.id,
        storageKey: file.storage_key,
        channel: "guest_token",
        requestId: request.id
      });

      return formatSuccessResponse(result);
    }
  );
};
