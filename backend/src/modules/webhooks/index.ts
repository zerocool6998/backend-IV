import type { FastifyPluginAsync } from "fastify";
import { webhooksRoutes } from "./routes.js";

export const registerWebhooksModule: FastifyPluginAsync = async (app) => {
  await app.register(webhooksRoutes, { prefix: "/webhooks" });
};
