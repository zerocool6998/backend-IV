import fastifyJwt from "@fastify/jwt";
import fp from "fastify-plugin";
import { getEnv } from "../config/env.js";
import { formatErrorResponse } from "../lib/http/errors.js";

export const authPlugin = fp(async (app) => {
  const env = getEnv();

  await app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    sign: {
      expiresIn: env.JWT_EXPIRES_IN
    }
  });

  app.decorate("authenticate", async (request, reply) => {
    try {
      await request.jwtVerify();

      if (!request.user.sub) {
        throw new Error("Missing subject claim");
      }
    } catch {
      return reply.code(401).send({
        ...formatErrorResponse({
          statusCode: 401,
          requestId: request.id,
          message: "Unauthorized",
          code: "AUTH_UNAUTHORIZED"
        })
      });
    }
  });

  app.decorate("requireAdmin", async (request, reply) => {
    await app.authenticate(request, reply);

    if (reply.sent) {
      return;
    }

    if (request.user.role !== "admin") {
      return reply.code(403).send({
        ...formatErrorResponse({
          statusCode: 403,
          requestId: request.id,
          message: "Forbidden",
          code: "AUTH_FORBIDDEN"
        })
      });
    }
  });
});
