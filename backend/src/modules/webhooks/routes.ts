import type { FastifyPluginAsync } from "fastify";
import { getEnv } from "../../config/env.js";
import { formatSuccessResponse } from "../../lib/http/response.js";
import { webhookRateLimitPolicy } from "../../lib/rate-limit/policies.js";
import { processWebhookEvent } from "./services/process-event.js";
import { verifyAndNormalizeWebhook } from "./services/verify-and-normalize.js";

export const webhooksRoutes: FastifyPluginAsync = async (app) => {
  app.addContentTypeParser("application/json", { parseAs: "string" }, (_request, body, done) => {
    done(null, body);
  });

  app.post<{ Body: string }>(
    "/stripe",
    {
      config: {
        rateLimit: webhookRateLimitPolicy
      }
    },
    async (request, reply) => {
      const env = getEnv();
      const rawBody = typeof request.body === "string" ? request.body : JSON.stringify(request.body);
      const event = verifyAndNormalizeWebhook(
        env,
        "stripe",
        rawBody,
        typeof request.headers["stripe-signature"] === "string"
          ? request.headers["stripe-signature"]
          : undefined
      );
      const outcome = await processWebhookEvent(app, event);

      return reply.code(outcome.statusCode).send(formatSuccessResponse({ received: true }));
    }
  );

  app.post<{ Body: string }>(
    "/paddle",
    {
      config: {
        rateLimit: webhookRateLimitPolicy
      }
    },
    async (request, reply) => {
      const env = getEnv();
      const rawBody = typeof request.body === "string" ? request.body : JSON.stringify(request.body);
      const event = verifyAndNormalizeWebhook(
        env,
        "paddle",
        rawBody,
        typeof request.headers["paddle-signature"] === "string"
          ? request.headers["paddle-signature"]
          : undefined
      );
      const outcome = await processWebhookEvent(app, event);

      return reply.code(outcome.statusCode).send(formatSuccessResponse({ received: true }));
    }
  );
};
