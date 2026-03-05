import { createRequire } from "node:module";
import { getEnv } from "./env.js";

const require = createRequire(import.meta.url);
const packageJson = require("../../package.json") as { version?: string };

export function getBuildInfo(): { version: string; build: { sha: string; timestamp: string } } {
  const env = getEnv();

  return {
    version: packageJson.version ?? "0.0.0",
    build: {
      sha: env.BUILD_SHA,
      timestamp: env.BUILD_TIMESTAMP
    }
  };
}
