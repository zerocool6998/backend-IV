import type { FastifyPluginAsync } from "fastify";
import { registerAdminModule } from "./admin/index.js";
import { registerAuthModule } from "./auth/index.js";
import { registerEntitlementsModule } from "./entitlements/index.js";
import { registerPaymentsModule } from "./payments/index.js";
import { registerProductsModule } from "./products/index.js";
import { registerWebhooksModule } from "./webhooks/index.js";

export const registerModules: FastifyPluginAsync = async (app) => {
  await app.register(registerAdminModule);
  await app.register(registerAuthModule);
  await app.register(registerProductsModule);
  await app.register(registerPaymentsModule);
  await app.register(registerWebhooksModule);
  await app.register(registerEntitlementsModule);
};
