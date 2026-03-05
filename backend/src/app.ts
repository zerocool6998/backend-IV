import Fastify, {
  type FastifyError,
  type FastifyInstance,
  type FastifyServerOptions
} from "fastify";
import { loggerOptions } from "./lib/logger/config.js";
import { registerModules } from "./modules/register.js";
import { formatErrorResponse } from "./lib/http/errors.js";
import { HttpError } from "./lib/http/exceptions.js";
import { dbPlugin } from "./plugins/db.js";
import { rateLimitPlugin } from "./plugins/rate-limit.js";
import { authPlugin } from "./plugins/auth.js";
import { securityPlugin } from "./plugins/security.js";
import { storagePlugin } from "./plugins/storage.js";
import { incrementMetric, observeMetric } from "./lib/metrics/index.js";

export function buildApp(options: FastifyServerOptions = {}): FastifyInstance {
  const app = Fastify({
    logger: loggerOptions,
    requestIdHeader: "x-request-id",
    requestIdLogLabel: "requestId",
    disableRequestLogging: true,
    ...options
  });

  void app.register(dbPlugin);
  void app.register(rateLimitPlugin);
  void app.register(authPlugin);
  void app.register(securityPlugin);
  void app.register(storagePlugin);
  void app.register(registerModules);

  app.addHook("onRequest", async (request, reply) => {
    request.startTime = process.hrtime.bigint();
    reply.header("X-Request-Id", request.id);
  });

  app.addHook("onResponse", async (request, reply) => {
    const durationNs =
      request.startTime === undefined ? 0n : process.hrtime.bigint() - request.startTime;
    const latencyMs = Number(durationNs) / 1_000_000;
    const route = request.routeOptions.url ?? request.url;
    const userId = request.user?.sub;

    incrementMetric("http.request.count", {
      method: request.method,
      route,
      statusCode: String(reply.statusCode)
    });
    observeMetric("http.request.latency_ms", latencyMs, {
      method: request.method,
      route
    });

    request.log.info(
      {
        route,
        method: request.method,
        statusCode: reply.statusCode,
        latencyMs,
        ...(userId ? { userId } : {})
      },
      "Request completed"
    );
  });

  app.setErrorHandler(async (error: FastifyError, request, reply) => {
    const statusCode = typeof error.statusCode === "number" ? error.statusCode : 500;
    const isValidationError = Array.isArray(error.validation);

    if (reply.sent) {
      return;
    }

    if (statusCode >= 500) {
      request.log.error({ err: error }, "Unhandled request error");
    }

    await reply.code(statusCode).send(
      formatErrorResponse({
        statusCode,
        requestId: request.id,
        message: statusCode >= 500 ? "Internal Server Error" : error.message,
        code:
          error instanceof HttpError
            ? error.code
            : isValidationError
              ? "VALIDATION_ERROR"
              : "REQUEST_ERROR",
        details: isValidationError ? error.validation : undefined
      })
    );
  });

  app.setNotFoundHandler(async (request, reply) => {
    await reply.code(404).send(
      formatErrorResponse({
        statusCode: 404,
        requestId: request.id,
        message: "Route not found",
        code: "NOT_FOUND"
      })
    );
  });

  return app;
}
