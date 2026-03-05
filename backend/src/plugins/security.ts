import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fp from "fastify-plugin";
import { getEnv } from "../config/env.js";

export const securityPlugin = fp(async (app) => {
  const env = getEnv();

  await app.register(fastifyHelmet, {
    global: true
  });

  await app.register(fastifyCors, {
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (env.CORS_ORIGINS.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed"), false);
    },
    credentials: true
  });
});
