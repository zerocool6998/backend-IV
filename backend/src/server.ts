import { buildApp } from "./app.js";
import { getEnv } from "./config/env.js";

const app = buildApp();
const env = getEnv();

const start = async (): Promise<void> => {
  try {
    await app.listen({
      host: env.HOST,
      port: env.PORT
    });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

await start();
