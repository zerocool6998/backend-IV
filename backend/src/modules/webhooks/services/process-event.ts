import type { FastifyInstance } from "fastify";
import { appendAuditLog } from "../../../db/repositories/audit-logs.js";
import { listProductIdsForOrder } from "../../../db/repositories/checkout-session-items.js";
import { findByProviderAndProviderSessionId, markCanceled, markCompleted, markExpired } from "../../../db/repositories/checkout-sessions.js";
import { createOrRefreshDownloadToken, expireDownloadTokenForOrder } from "../../../db/repositories/download-tokens.js";
import { suspendEntitlementsForOrder, upsertEntitlementForPaidOrder } from "../../../db/repositories/entitlements.js";
import { updateOrderStatus, findByCheckoutSessionId } from "../../../db/repositories/orders.js";
import { findByProviderPaymentId, insertPayment, markPaymentStatus } from "../../../db/repositories/payments.js";
import {
  findByProviderAndEventId,
  insertWebhookEvent,
  markFailed,
  markIgnored,
  markProcessed
} from "../../../db/repositories/webhook-events.js";
import { withTransaction } from "../../../db/repositories/_shared/transaction.js";
import {
  lockCheckoutSessionById,
  lockOrderById,
  lockPaymentByProviderAndPaymentId,
  lockWebhookEventByProviderAndEventId
} from "../../../db/repositories/_shared/locks.js";
import type { OrderStatus, PaymentStatus } from "../../../db/types.js";
import { getEnv } from "../../../config/env.js";
import { HttpError } from "../../../lib/http/exceptions.js";
import { incrementMetric } from "../../../lib/metrics/index.js";
import type { NormalizedWebhookEvent } from "../adapters/types.js";

type ProcessWebhookOutcome = {
  statusCode: 200 | 500;
};

function isUnsupportedTransition(event: NormalizedWebhookEvent): boolean {
  return event.transition === "unsupported";
}

function getStatusForTransition(
  transition: NormalizedWebhookEvent["transition"]
): { orderStatus?: OrderStatus; paymentStatus?: PaymentStatus } {
  switch (transition) {
    case "payment_succeeded":
      return { orderStatus: "paid", paymentStatus: "paid" };
    case "payment_failed":
      return { orderStatus: "failed", paymentStatus: "failed" };
    case "checkout_canceled":
    case "checkout_expired":
      return { orderStatus: "canceled" };
    case "payment_refunded":
      return { orderStatus: "refunded", paymentStatus: "refunded" };
    case "payment_disputed":
      return { orderStatus: "disputed", paymentStatus: "disputed" };
    default:
      return {};
  }
}

export async function processWebhookEvent(
  app: FastifyInstance,
  event: NormalizedWebhookEvent
): Promise<ProcessWebhookOutcome> {
  const env = getEnv();
  const inserted = await insertWebhookEvent(app.db, {
    provider: event.provider,
    providerEventId: event.providerEventId,
    eventType: event.eventType,
    ...(event.correlationId ? { correlationId: event.correlationId } : {}),
    ...(event.occurredAt ? { providerCreatedAt: new Date(event.occurredAt) } : {}),
    payload: event.payload
  });

  if (!inserted) {
    incrementMetric("webhook.ignored.count", {
      provider: event.provider,
      reason: "duplicate_event"
    });
    return { statusCode: 200 };
  }

  if (isUnsupportedTransition(event)) {
    await markIgnored(app.db, inserted.id, {
      outcome: "ignored",
      reason: event.ignoreReason ?? "unsupported_event_type"
    });

    incrementMetric("webhook.ignored.count", {
      provider: event.provider,
      reason: event.ignoreReason ?? "unsupported_event_type"
    });
    return { statusCode: 200 };
  }

  try {
    await withTransaction(app.db, async (client) => {
      const lockedWebhook = await lockWebhookEventByProviderAndEventId(
        client,
        event.provider,
        event.providerEventId
      );

      if (!lockedWebhook) {
        return;
      }

      const resolvedSession =
        (event.correlationId ? await lockCheckoutSessionById(client, event.correlationId) : null) ??
        (event.providerSessionId
          ? await findByProviderAndProviderSessionId(client, event.provider, event.providerSessionId)
          : null);

      if (!resolvedSession) {
        await markIgnored(client, lockedWebhook.id, {
          outcome: "ignored",
          reason: "unknown_correlation"
        });
        return;
      }

      const order = await findByCheckoutSessionId(client, resolvedSession.id);

      if (!order) {
        await markIgnored(client, lockedWebhook.id, {
          outcome: "ignored",
          reason: "missing_order"
        });
        return;
      }

      const lockedOrder = await lockOrderById(client, order.id);

      if (!lockedOrder) {
        await markIgnored(client, lockedWebhook.id, {
          outcome: "ignored",
          reason: "missing_order"
        });
        return;
      }

      const nextStatuses = getStatusForTransition(event.transition);
      let paymentId: string | null = null;

      if (event.providerPaymentId && nextStatuses.paymentStatus) {
        const existingPayment =
          (await lockPaymentByProviderAndPaymentId(client, event.provider, event.providerPaymentId)) ??
          (await findByProviderPaymentId(client, event.provider, event.providerPaymentId));

        const payment =
          existingPayment ??
          (await insertPayment(client, {
            orderId: lockedOrder.id,
            provider: event.provider,
            providerPaymentId: event.providerPaymentId,
            ...(event.providerSessionId ? { providerSessionId: event.providerSessionId } : {}),
            status: nextStatuses.paymentStatus,
            amountCents: lockedOrder.total_cents,
            currency: lockedOrder.currency
          }));

        paymentId = payment.id;

        if (existingPayment) {
          await markPaymentStatus(client, existingPayment.id, nextStatuses.paymentStatus);
        }
      }

      switch (event.transition) {
        case "payment_succeeded":
          await markCompleted(client, resolvedSession.id);
          break;
        case "checkout_expired":
          await markExpired(client, resolvedSession.id);
          break;
        case "checkout_canceled":
          await markCanceled(client, resolvedSession.id);
          break;
        default:
          break;
      }

      if (nextStatuses.orderStatus) {
        await updateOrderStatus(client, lockedOrder.id, nextStatuses.orderStatus);
      }

      if (event.transition === "payment_succeeded") {
        // Entitlements are access control: grant once per distinct product, not per quantity.
        const productIds = await listProductIdsForOrder(client, lockedOrder.id);

        if (lockedOrder.user_id) {
          for (const productId of productIds) {
            await upsertEntitlementForPaidOrder(client, {
              userId: lockedOrder.user_id,
              productId,
              orderId: lockedOrder.id
            });
          }

          await appendAuditLog(client, {
            entityType: "order",
            entityId: lockedOrder.id,
            action: "entitlements_upserted",
            metadata: {
              webhookEventId: lockedWebhook.id,
              orderId: lockedOrder.id,
              productIds
            }
          });
        } else if (resolvedSession.guest_download_token_hash) {
          await createOrRefreshDownloadToken(client, {
            orderId: lockedOrder.id,
            tokenHash: resolvedSession.guest_download_token_hash,
            expiresAt: new Date(Date.now() + env.DOWNLOAD_TOKEN_TTL_SECONDS * 1000)
          });

          await appendAuditLog(client, {
            entityType: "order",
            entityId: lockedOrder.id,
            action: "guest_download_token_created",
            metadata: {
              webhookEventId: lockedWebhook.id,
              orderId: lockedOrder.id
            }
          });
        }
      }

      if (event.transition === "payment_refunded" || event.transition === "payment_disputed") {
        if (lockedOrder.user_id) {
          await suspendEntitlementsForOrder(client, {
            orderId: lockedOrder.id,
            reason: event.transition === "payment_refunded" ? "refunded" : "disputed"
          });
        } else {
          await expireDownloadTokenForOrder(client, lockedOrder.id);
        }

        await appendAuditLog(client, {
          entityType: "order",
          entityId: lockedOrder.id,
          action: "fulfillment_access_suspended",
          metadata: {
            webhookEventId: lockedWebhook.id,
            orderId: lockedOrder.id,
            reason: event.transition === "payment_refunded" ? "refunded" : "disputed"
          }
        });
      }

      await appendAuditLog(client, {
        entityType: "webhook_event",
        entityId: lockedWebhook.id,
        action: "webhook_processed",
        metadata: {
          webhookEventId: lockedWebhook.id,
          provider: event.provider,
          providerEventId: event.providerEventId,
          checkoutSessionId: resolvedSession.id,
          orderId: lockedOrder.id,
          paymentId,
          transition: event.transition
        }
      });

      await markProcessed(client, lockedWebhook.id, {
        outcome: "processed",
        transition: event.transition,
        checkoutSessionId: resolvedSession.id,
        orderId: lockedOrder.id,
        paymentId
      });
    });

    incrementMetric("webhook.processed.count", {
      provider: event.provider,
      transition: event.transition
    });

    return { statusCode: 200 };
  } catch (error) {
    incrementMetric("webhook.failed.count", {
      provider: event.provider
    });
    app.log.error({ err: error, providerEventId: event.providerEventId }, "Webhook processing failed");

    const storedEvent = await findByProviderAndEventId(app.db, event.provider, event.providerEventId);

    if (storedEvent) {
      await markFailed(app.db, storedEvent.id, error instanceof Error ? error.message : "Unknown error", {
        outcome: "failed"
      });
    }

    throw new HttpError(500, "WEBHOOK_TRANSIENT_FAILURE", "Webhook processing failed");
  }
}
