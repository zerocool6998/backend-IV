import fastifyRateLimit from "@fastify/rate-limit";
import fp from "fastify-plugin";
import { getEnv } from "../config/env.js";
import { globalRateLimitPolicy } from "../lib/rate-limit/policies.js";

export const rateLimitPlugin = fp(async (app) => {
  const env = getEnv();

  await app.register(fastifyRateLimit, {
    global: true,
    max: env.RATE_LIMIT_MAX || globalRateLimitPolicy.max,
    timeWindow: env.RATE_LIMIT_WINDOW || globalRateLimitPolicy.timeWindow
  });
});
