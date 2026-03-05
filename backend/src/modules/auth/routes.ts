import type { FastifyPluginAsync } from "fastify";
import { findUserByEmail, findUserById } from "../../db/repositories/users.js";
import { verifyPassword } from "../../lib/crypto/index.js";
import { HttpError } from "../../lib/http/exceptions.js";
import { formatSuccessResponse } from "../../lib/http/response.js";

type LoginBody = {
  email: string;
  password: string;
};

export const authRoutes: FastifyPluginAsync = async (app) => {
  app.post<{ Body: LoginBody }>(
    "/auth/login",
    {
      schema: {
        body: {
          type: "object",
          required: ["email", "password"],
          additionalProperties: false,
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 8 }
          }
        }
      }
    },
    async (request, reply) => {
      const { email, password } = request.body;
      const user = await findUserByEmail(app.db, email);
      const isAuthorized = user ? await verifyPassword(password, user.password_hash) : false;

      if (!user || !isAuthorized) {
        throw new HttpError(401, "AUTH_INVALID_CREDENTIALS", "Invalid credentials");
      }

      const token = await reply.jwtSign({
        sub: user.id,
        role: user.role,
        token_version: user.token_version
      });

      return reply.send(
        formatSuccessResponse({
          accessToken: token,
          tokenType: "Bearer",
          expiresIn: "15m",
          user: {
            id: user.id,
            email: user.email,
            role: user.role
          }
        })
      );
    }
  );

  app.get("/me", { preHandler: app.authenticate }, async (request) => {
    const user = await findUserById(app.db, request.user.sub);

    if (!user) {
      throw new HttpError(404, "USER_NOT_FOUND", "User not found");
    }

    return formatSuccessResponse({
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  });
};
