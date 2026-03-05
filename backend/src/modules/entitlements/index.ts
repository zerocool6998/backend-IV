import type { FastifyPluginAsync } from "fastify";
import { entitlementsRoutes } from "./routes.js";

export const registerEntitlementsModule: FastifyPluginAsync = async (app) => {
  await app.register(entitlementsRoutes);
};
