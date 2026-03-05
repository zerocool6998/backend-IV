import type { FastifyLoggerOptions } from "fastify";

export const loggerOptions = {
  level: process.env.NODE_ENV === "test" ? "silent" : "info",
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "*.authorization",
      "*.guestSecret",
      "*.token",
      "*.jwt",
      "*.storageSecretAccessKey",
      "*.storageAccessKeyId"
    ],
    censor: "[REDACTED]"
  }
} as FastifyLoggerOptions;
