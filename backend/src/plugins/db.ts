import fp from "fastify-plugin";
import pg from "pg";
import { getEnv } from "../config/env.js";

const { Pool } = pg;

export const dbPlugin = fp(async (app) => {
  const env = getEnv();

  const pool = new Pool({
    connectionString: env.DATABASE_URL,
    max: 10
  });

  app.decorate("db", pool);

  app.addHook("onClose", async () => {
    await pool.end();
  });
});
