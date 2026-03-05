import type { FastifyPluginAsync } from "fastify";
import { authRoutes } from "./routes.js";

export const registerAuthModule: FastifyPluginAsync = async (app) => {
  await app.register(authRoutes);
};
