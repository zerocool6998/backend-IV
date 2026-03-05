import type { FastifyPluginAsync } from "fastify";
import { adminRoutes } from "./routes.js";

export const registerAdminModule: FastifyPluginAsync = async (app) => {
  await app.register(adminRoutes);
};
