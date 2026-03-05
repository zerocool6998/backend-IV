import type { StorageService } from "../lib/storage/index.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { Pool } from "pg";

type AuthPreHandler = (request: FastifyRequest, reply: FastifyReply) => Promise<void>;

declare module "fastify" {
  interface FastifyInstance {
    db: Pool;
    storage: StorageService;
    authenticate: AuthPreHandler;
    requireAdmin: AuthPreHandler;
  }

  interface FastifyRequest {
    startTime?: bigint;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      sub: string;
      role: string;
      token_version: number;
    };
    user: {
      sub: string;
      role: string;
      token_version: number;
    };
  }
}
