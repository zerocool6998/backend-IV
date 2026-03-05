# IV Backend

Fastify + TypeScript backend with JWT auth, PostgreSQL migrations, product catalog APIs, guest-safe checkout orchestration, and transactional webhook processing for Stripe and Paddle.

## Stack

- Node.js 22+ (current LTS line)
- Fastify
- `@fastify/jwt`
- `@fastify/rate-limit`
- PostgreSQL via `pg`
- `node-pg-migrate`
- `zod` for environment validation
- `argon2` for password hashing
- ESLint + Prettier
- Vitest

## Setup

1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env` and update values.
3. Run database migrations:
   `npm run migrate:up`
4. Seed local development data:
   `npm run seed:dev`
5. Start the dev server:
   `npm run dev`

Required checkout/webhook env vars:
- `FRONTEND_BASE_URL`
- `CHECKOUT_SUCCESS_PATH`
- `CHECKOUT_CANCEL_PATH`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `PADDLE_API_KEY`
- `PADDLE_WEBHOOK_SECRET`
- `PADDLE_ENVIRONMENT`

## Local Docker

- `docker compose up --build` starts Postgres and the API.
- `docker compose --profile s3 up --build` also starts MinIO for S3-compatible local testing.

## Scripts

- `npm run dev` starts the server with file watching.
- `npm run typecheck` runs strict TypeScript checks without emitting.
- `npm run build` compiles to `dist/`.
- `npm run start` runs the compiled server.
- `npm run lint` checks lint rules.
- `npm run format` checks formatting.
- `npm run test` runs the test suite.
- `npm run migrate:up` applies migrations.
- `npm run migrate:down` rolls back one migration.
- `npm run migrate:validate` parses and dry-runs migrations for CI validation.
- `npm run migrate:create -- migration_name` creates a new migration file.
- `npm run seed:dev` creates idempotent local seed records.

## API

- Success responses use a consistent top-level `data` object.
- Error responses use a consistent top-level `error` object with `code`, `message`, `statusCode`, `requestId`, and optional `details`.
- `X-Request-Id` is accepted from clients and returned on every response; Fastify generates one when the header is missing.
- Structured request logs include the request id under the `requestId` field.
- CORS is restricted to configured frontend origins from `CORS_ORIGINS`.
- `GET /health` returns service and database readiness.
- `GET /products` lists active products without auth.
- `GET /products/:id` returns product detail with `availableFormats` and no storage keys.
- `POST /auth/login` authenticates a database user and issues a JWT access token.
- `GET /me` returns the authenticated user profile.
- `GET /me/library` returns the authenticated user's entitlements.
- `POST /checkout-sessions` creates an internal checkout session and returns a one-time `guestSecret` for guest-owned sessions.
- `POST /checkout-sessions/:id/start` starts Stripe or Paddle checkout and returns a redirect URL.
- `POST /webhooks/stripe` verifies, deduplicates, and processes Stripe events.
- `POST /webhooks/paddle` verifies, deduplicates, and processes Paddle events.

## Data Invariants

- `checkout_sessions` monetary totals are provisional pre-payment values and may be updated while the session is still in progress.
- `orders` monetary totals are the authoritative commercial snapshot and should not be changed after creation except for status transitions.
- Entitlements are product-level in v1; owning a product entitlement implies access to all of that product's formats.
- Guest checkout ownership is enforced by a one-time `guestSecret`; the server stores only a hash.
- Success and cancel redirect URLs are server-controlled from env configuration; clients cannot supply arbitrary return URLs.
- Payment rows are created only when webhook payloads include a stable provider payment identifier.
- Webhook correlation resolves from metadata/custom data first, then falls back to stored `(provider, provider_session_id)`.

## Layout

- `src/modules/` contains domain modules: `auth`, `products`, `payments`, `webhooks`, `entitlements`, and `admin`.
- `src/db/` contains `migrations`, `queries`, and `repositories`.
- `src/lib/` contains cross-cutting utilities such as `crypto`, `storage`, `logger`, and rate-limit policy definitions.

## Rollback

- `npm run migrate:down` rolls back the most recent migration only.
- The latest core migration drops tables in reverse dependency order to keep rollback safe for local development.
- Production rollback of financial and audit tables should be exceptional and done with a backup-aware process.

## Checkout And Webhooks

- `POST /checkout-sessions` requires the `Idempotency-Key` header.
- Guest checkout is supported for payment capture, but guest fulfillment/claim flows are deferred to a later phase. The `guest_purchase_claims` table is present as a schema hook only.
- Starting an already-started checkout session with the same provider returns the persisted provider URL; starting it with a different provider returns a conflict.
- Duplicate webhook events are ignored before side effects because `webhook_events` is inserted first under the unique `(provider, provider_event_id)` constraint.
- Unsupported events and unknown correlation are marked `ignored` and return `200`; only transient failures should return `500` for provider retries.

## Seed Data

- `npm run seed:dev` upserts one active product, two product file formats (`pdf`, `epub`), and one dev user.
- The seeded login is `dev@example.com` with password `local-dev-password`.
