import type { FastifyPluginAsync } from "fastify";
import { paymentsRoutes } from "./routes.js";

export const registerPaymentsModule: FastifyPluginAsync = async (app) => {
  await app.register(paymentsRoutes);
};
