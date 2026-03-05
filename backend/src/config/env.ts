import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  HOST: z.string().min(1).default("0.0.0.0"),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters long."),
  JWT_EXPIRES_IN: z.string().min(1).default("15m"),
  GUEST_SECRET_HMAC_KEY: z.string().min(
    32,
    "GUEST_SECRET_HMAC_KEY must be at least 32 characters long."
  ),
  DOWNLOAD_TOKEN_HMAC_KEY: z.string().min(
    32,
    "DOWNLOAD_TOKEN_HMAC_KEY must be at least 32 characters long."
  ),
  FRONTEND_BASE_URL: z.string().url(),
  CHECKOUT_SUCCESS_PATH: z.string().startsWith("/"),
  CHECKOUT_CANCEL_PATH: z.string().startsWith("/"),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  PADDLE_API_KEY: z.string().min(1),
  PADDLE_WEBHOOK_SECRET: z.string().min(1),
  PADDLE_ENVIRONMENT: z.enum(["sandbox", "production"]),
  STORAGE_ENDPOINT: z.string().url(),
  STORAGE_REGION: z.string().min(1),
  STORAGE_BUCKET: z.string().min(1),
  STORAGE_ACCESS_KEY_ID: z.string().min(1),
  STORAGE_SECRET_ACCESS_KEY: z.string().min(1),
  STORAGE_FORCE_PATH_STYLE: z
    .string()
    .optional()
    .transform((value) => value !== "false"),
  STORAGE_HEALTHCHECK_KEY: z.string().min(1),
  DOWNLOAD_URL_TTL_SECONDS: z.coerce.number().int().min(60).max(180).default(120),
  DOWNLOAD_TOKEN_TTL_SECONDS: z.coerce.number().int().positive().default(604800),
  UPLOAD_URL_TTL_SECONDS: z.coerce.number().int().positive().default(900),
  CORS_ORIGINS: z
    .string()
    .min(1)
    .transform((value) =>
      value
        .split(",")
        .map((origin) => origin.trim())
        .filter((origin) => origin.length > 0)
    )
    .refine((origins) => origins.length > 0, "CORS_ORIGINS must include at least one origin."),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
  RATE_LIMIT_WINDOW: z.string().min(1).default("1 minute"),
  BUILD_SHA: z.string().min(1).default("local"),
  BUILD_TIMESTAMP: z.string().datetime().default("1970-01-01T00:00:00.000Z")
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | undefined;

export function getEnv(): Env {
  if (cachedEnv) {
    return cachedEnv;
  }

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formattedErrors = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    throw new Error(`Invalid environment configuration:\n${formattedErrors}`);
  }

  cachedEnv = result.data;

  return cachedEnv;
}
