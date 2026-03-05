import type { FastifyPluginAsync } from "fastify";
import { checkoutCreateRateLimitPolicy, checkoutStartRateLimitPolicy } from "../../lib/rate-limit/policies.js";
import { formatSuccessResponse } from "../../lib/http/response.js";
import { createCheckoutSession } from "./services/create-checkout-session.js";
import { startCheckoutSession } from "./services/start-checkout-session.js";

type CreateCheckoutBody = {
  currency: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  guestEmail?: string;
};

type StartCheckoutBody = {
  provider: "stripe" | "paddle";
  guestSecret?: string;
};

export const paymentsRoutes: FastifyPluginAsync = async (app) => {
  app.post<{ Body: CreateCheckoutBody }>(
    "/checkout-sessions",
    {
      config: {
        rateLimit: checkoutCreateRateLimitPolicy
      },
      schema: {
        body: {
          type: "object",
          required: ["currency", "items"],
          additionalProperties: false,
          properties: {
            currency: { type: "string", minLength: 3, maxLength: 3 },
            guestEmail: { type: "string", format: "email" },
            items: {
              type: "array",
              minItems: 1,
              items: {
                type: "object",
                required: ["productId", "quantity"],
                additionalProperties: false,
                properties: {
                  productId: { type: "string", format: "uuid" },
                  quantity: { type: "integer", minimum: 1 }
                }
              }
            }
          }
        }
      }
    },
    async (request, reply) => {
      const result = await createCheckoutSession(request);

      return reply.code(result.wasCreated ? 201 : 200).send(formatSuccessResponse(result.data));
    }
  );

  app.post<{ Params: { id: string }; Body: StartCheckoutBody }>(
    "/checkout-sessions/:id/start",
    {
      config: {
        rateLimit: checkoutStartRateLimitPolicy
      },
      schema: {
        body: {
          type: "object",
          required: ["provider"],
          additionalProperties: false,
          properties: {
            provider: { type: "string", enum: ["stripe", "paddle"] },
            guestSecret: { type: "string", minLength: 16 }
          }
        }
      }
    },
    async (request) => {
      const result = await startCheckoutSession(request);

      return formatSuccessResponse(result);
    }
  );
};
