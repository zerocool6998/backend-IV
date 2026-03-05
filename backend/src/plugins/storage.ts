import fp from "fastify-plugin";
import { getEnv } from "../config/env.js";
import { createStorageService } from "../lib/storage/index.js";

export const storagePlugin = fp(async (app) => {
  const env = getEnv();
  const storage = createStorageService(env);

  app.decorate("storage", storage);
});
