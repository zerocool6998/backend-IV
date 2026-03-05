import type { FastifyPluginAsync } from "fastify";
import { productsRoutes } from "./routes.js";

export const registerProductsModule: FastifyPluginAsync = async (app) => {
  await app.register(productsRoutes, { prefix: "/products" });
};
