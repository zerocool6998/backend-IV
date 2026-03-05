import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { hashPassword } from "./lib/crypto/index.js";

type QueryResultRow = Record<string, unknown>;

function asRow<TRow extends QueryResultRow>(value: QueryResultRow): TRow {
  return value as unknown as TRow;
}

describe("buildApp", () => {
  const originalEnv = { ...process.env };
  const originalFetch = globalThis.fetch;

  beforeAll(() => {
    process.env.NODE_ENV = "test";
    process.env.HOST = "127.0.0.1";
    process.env.PORT = "4000";
    process.env.DATABASE_URL = "postgres://postgres:postgres@localhost:5432/iv_backend";
    process.env.JWT_SECRET = "12345678901234567890123456789012";
    process.env.JWT_EXPIRES_IN = "15m";
    process.env.GUEST_SECRET_HMAC_KEY = "12345678901234567890123456789012";
    process.env.DOWNLOAD_TOKEN_HMAC_KEY = "12345678901234567890123456789013";
    process.env.FRONTEND_BASE_URL = "http://localhost:3000";
    process.env.CHECKOUT_SUCCESS_PATH = "/checkout/success";
    process.env.CHECKOUT_CANCEL_PATH = "/checkout/cancel";
    process.env.STRIPE_SECRET_KEY = "sk_test_123";
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_123";
    process.env.PADDLE_API_KEY = "pdl_test_123";
    process.env.PADDLE_WEBHOOK_SECRET = "paddle_secret_123";
    process.env.PADDLE_ENVIRONMENT = "sandbox";
    process.env.STORAGE_ENDPOINT = "http://localhost:9000";
    process.env.STORAGE_REGION = "us-east-1";
    process.env.STORAGE_BUCKET = "iv-downloads";
    process.env.STORAGE_ACCESS_KEY_ID = "minioadmin";
    process.env.STORAGE_SECRET_ACCESS_KEY = "minioadmin";
    process.env.STORAGE_FORCE_PATH_STYLE = "true";
    process.env.STORAGE_HEALTHCHECK_KEY = "healthcheck.txt";
    process.env.DOWNLOAD_URL_TTL_SECONDS = "120";
    process.env.DOWNLOAD_TOKEN_TTL_SECONDS = "604800";
    process.env.UPLOAD_URL_TTL_SECONDS = "900";
    process.env.CORS_ORIGINS = "http://localhost:3000";
    process.env.RATE_LIMIT_MAX = "100";
    process.env.RATE_LIMIT_WINDOW = "1 minute";
    process.env.BUILD_SHA = "test-sha";
    process.env.BUILD_TIMESTAMP = "2026-03-03T00:00:00.000Z";
  });

  afterAll(() => {
    process.env = originalEnv;
    globalThis.fetch = originalFetch;
  });

  async function createApp() {
    vi.restoreAllMocks();
    const { buildApp } = await import("./app.js");
    const app = buildApp({ logger: false });
    await app.ready();

    const passwordHash = await hashPassword("local-dev-password");
    const now = new Date("2026-03-03T00:00:00.000Z");
    const userId = "11111111-1111-1111-1111-111111111111";

    const state = {
      checkoutSessions: [] as Array<Record<string, unknown>>,
      checkoutSessionItems: [] as Array<Record<string, unknown>>,
      orders: [] as Array<Record<string, unknown>>,
      auditLogs: [] as Array<Record<string, unknown>>
    };

    const stubQuery = (async <TRow extends QueryResultRow>(
      textOrConfig: string | { text: string },
      values?: unknown[]
    ) => {
      const text = typeof textOrConfig === "string" ? textOrConfig : textOrConfig.text;

      if (text.includes("select 1")) {
        return { rows: [asRow<TRow>({})], command: "SELECT", rowCount: 1, oid: 0, fields: [] };
      }

      if (text.includes("from products") && text.includes("where is_active = true") && text.includes("order by created_at")) {
        return {
          rows: [
            asRow<TRow>({
              id: "00000000-0000-0000-0000-000000000001",
              slug: "starter-product",
              title: "Starter Product",
              description: "Public description",
              price_cents: 4900,
              currency: "USD"
            })
          ],
          command: "SELECT",
          rowCount: 1,
          oid: 0,
          fields: []
        };
      }

      if (text.includes("from products") && text.includes("where id = $1") && text.includes("and is_active = true")) {
        if (values?.[0] === "00000000-0000-0000-0000-000000000001") {
          return {
            rows: [
              asRow<TRow>({
                id: "00000000-0000-0000-0000-000000000001",
                slug: "starter-product",
                title: "Starter Product",
                description: "Public description",
                price_cents: 4900,
                currency: "USD"
              })
            ],
            command: "SELECT",
            rowCount: 1,
            oid: 0,
            fields: []
          };
        }

        return { rows: [] as TRow[], command: "SELECT", rowCount: 0, oid: 0, fields: [] };
      }

      if (text.includes("from products") && text.includes("where id = any")) {
        return {
          rows: [
            asRow<TRow>({
              id: "00000000-0000-0000-0000-000000000001",
              slug: "starter-product",
              title: "Starter Product",
              description: "Public description",
              is_active: true,
              price_cents: 4900,
              currency: "USD",
              created_at: now,
              updated_at: now
            })
          ],
          command: "SELECT",
          rowCount: 1,
          oid: 0,
          fields: []
        };
      }

      if (text.includes("from product_files") && text.includes("select kind")) {
        return {
          rows: [asRow<TRow>({ kind: "epub" }), asRow<TRow>({ kind: "pdf" })],
          command: "SELECT",
          rowCount: 2,
          oid: 0,
          fields: []
        };
      }

      if (text.includes("from users") && text.includes("where email = $1")) {
        if (values?.[0] === "dev@example.com") {
          return {
            rows: [
              asRow<TRow>({
                id: userId,
                email: "dev@example.com",
                password_hash: passwordHash,
                role: "customer",
                token_version: 0,
                created_at: now,
                updated_at: now
              })
            ],
            command: "SELECT",
            rowCount: 1,
            oid: 0,
            fields: []
          };
        }

        return { rows: [] as TRow[], command: "SELECT", rowCount: 0, oid: 0, fields: [] };
      }

      if (text.includes("from users") && text.includes("where id = $1")) {
        if (values?.[0] === userId) {
          return {
            rows: [
              asRow<TRow>({
                id: userId,
                email: "dev@example.com",
                password_hash: passwordHash,
                role: "customer",
                token_version: 0,
                created_at: now,
                updated_at: now
              })
            ],
            command: "SELECT",
            rowCount: 1,
            oid: 0,
            fields: []
          };
        }

        return { rows: [] as TRow[], command: "SELECT", rowCount: 0, oid: 0, fields: [] };
      }

      if (text.includes("select count(*)::text as count") && text.includes("from checkout_sessions")) {
        const [matchValue, since] = values as [string, Date];
        const key = text.includes("where identity_key") ? "identity_key" : "guest_email";
        const count = state.checkoutSessions.filter(
          (row) =>
            row[key] === matchValue &&
            row.created_at instanceof Date &&
            row.created_at >= since
        ).length;

        return {
          rows: [asRow<TRow>({ count: String(count) })],
          command: "SELECT",
          rowCount: 1,
          oid: 0,
          fields: []
        };
      }

      if (text.includes("from checkout_sessions") && text.includes("where identity_key = $1")) {
        const found =
          state.checkoutSessions.find(
            (row) => row.identity_key === values?.[0] && row.client_idempotency_key === values?.[1]
          ) ?? null;

        return {
          rows: found ? [asRow<TRow>(found)] : [],
          command: "SELECT",
          rowCount: found ? 1 : 0,
          oid: 0,
          fields: []
        };
      }

      if (text.includes("insert into checkout_sessions")) {
        const row = {
          id: "cs-1",
          identity_key: values?.[0],
          user_id: values?.[1] ?? null,
          guest_email: values?.[2] ?? null,
          guest_secret_hash: values?.[3] ?? null,
          guest_download_token_hash: values?.[4] ?? null,
          client_idempotency_key: values?.[5] ?? null,
          provider: null,
          provider_session_id: null,
          provider_checkout_url: null,
          currency: values?.[6],
          subtotal_cents: values?.[7],
          discount_cents: values?.[8],
          tax_cents: values?.[9],
          total_cents: values?.[10],
          state: values?.[11],
          started_at: null,
          completed_at: null,
          expires_at: null,
          created_at: now,
          updated_at: now
        };
        state.checkoutSessions.push(row);

        return {
          rows: [asRow<TRow>(row)],
          command: "INSERT",
          rowCount: 1,
          oid: 0,
          fields: []
        };
      }

      if (text.includes("insert into checkout_session_items")) {
        const row = {
          id: `csi-${state.checkoutSessionItems.length + 1}`,
          checkout_session_id: values?.[0],
          product_id: values?.[1],
          unit_amount_cents: values?.[2],
          quantity: values?.[3],
          created_at: now
        };
        state.checkoutSessionItems.push(row);

        return {
          rows: [asRow<TRow>(row)],
          command: "INSERT",
          rowCount: 1,
          oid: 0,
          fields: []
        };
      }

      if (text.includes("from checkout_session_items")) {
        const rows = state.checkoutSessionItems.filter((row) => row.checkout_session_id === values?.[0]);

        return {
          rows: rows.map((row) => asRow<TRow>(row)),
          command: "SELECT",
          rowCount: rows.length,
          oid: 0,
          fields: []
        };
      }

      if (text.includes("from checkout_sessions") && text.includes("and user_id is null")) {
        const found =
          state.checkoutSessions.find(
            (row) => row.id === values?.[0] && row.user_id === null
          ) ?? null;

        return {
          rows: found ? [asRow<TRow>(found)] : [],
          command: "SELECT",
          rowCount: found ? 1 : 0,
          oid: 0,
          fields: []
        };
      }

      if (text.includes("from checkout_sessions") && text.includes("and user_id = $2")) {
        const found =
          state.checkoutSessions.find(
            (row) => row.id === values?.[0] && row.user_id === values?.[1]
          ) ?? null;

        return {
          rows: found ? [asRow<TRow>(found)] : [],
          command: "SELECT",
          rowCount: found ? 1 : 0,
          oid: 0,
          fields: []
        };
      }

      if (text.includes("from orders") && text.includes("where checkout_session_id = $1")) {
        const found = state.orders.find((row) => row.checkout_session_id === values?.[0]) ?? null;

        return {
          rows: found ? [asRow<TRow>(found)] : [],
          command: "SELECT",
          rowCount: found ? 1 : 0,
          oid: 0,
          fields: []
        };
      }

      if (text.includes("insert into orders")) {
        const row = {
          id: "order-1",
          identity_key: values?.[0],
          user_id: values?.[1] ?? null,
          guest_email: values?.[2] ?? null,
          checkout_session_id: values?.[3],
          currency: values?.[4],
          subtotal_cents: values?.[5],
          discount_cents: values?.[6],
          tax_cents: values?.[7],
          total_cents: values?.[8],
          status: values?.[9],
          created_at: now,
          updated_at: now
        };
        state.orders.push(row);

        return {
          rows: [asRow<TRow>(row)],
          command: "INSERT",
          rowCount: 1,
          oid: 0,
          fields: []
        };
      }

      if (text.includes("update checkout_sessions") && text.includes("set provider = $2")) {
        const found = state.checkoutSessions.find((row) => row.id === values?.[0]);

        if (!found) {
          return { rows: [] as TRow[], command: "UPDATE", rowCount: 0, oid: 0, fields: [] };
        }

        found.provider = values?.[1];
        found.provider_session_id = values?.[2];
        found.provider_checkout_url = values?.[3];
        found.expires_at = values?.[4] ?? null;
        found.started_at = now;
        found.state = "started";
        found.updated_at = now;

        return {
          rows: [asRow<TRow>(found)],
          command: "UPDATE",
          rowCount: 1,
          oid: 0,
          fields: []
        };
      }

      if (text.includes("insert into audit_logs")) {
        const row = {
          id: `audit-${state.auditLogs.length + 1}`,
          actor_user_id: values?.[0] ?? null,
          entity_type: values?.[1],
          entity_id: values?.[2],
          action: values?.[3],
          metadata: values?.[4],
          created_at: now
        };
        state.auditLogs.push(row);

        return {
          rows: [asRow<TRow>(row)],
          command: "INSERT",
          rowCount: 1,
          oid: 0,
          fields: []
        };
      }

      if (text.includes("from entitlements")) {
        return { rows: [] as TRow[], command: "SELECT", rowCount: 0, oid: 0, fields: [] };
      }

      throw new Error(`Unhandled test query: ${text}`);
    }) as typeof app.db.query;

    app.db.query = stubQuery;

    return app;
  }

  it("returns health with build info", async () => {
    const app = await createApp();
    const response = await app.inject({
      method: "GET",
      url: "/health"
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers["x-request-id"]).toBeDefined();
    expect(response.json()).toEqual({
      data: {
        status: "ok",
        version: "0.1.0",
        build: {
          sha: "test-sha",
          timestamp: "2026-03-03T00:00:00.000Z"
        }
      }
    });

    await app.close();
  });

  it("returns public products without sensitive fields", async () => {
    const app = await createApp();
    const response = await app.inject({
      method: "GET",
      url: "/products"
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      data: {
        items: [
          {
            id: "00000000-0000-0000-0000-000000000001",
            slug: "starter-product",
            title: "Starter Product",
            description: "Public description",
            priceCents: 4900,
            currency: "USD"
          }
        ]
      }
    });

    await app.close();
  });

  it("logs in, returns JWT claims, and protects library", async () => {
    const app = await createApp();
    const login = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: {
        email: "dev@example.com",
        password: "local-dev-password"
      }
    });

    expect(login.statusCode).toBe(200);
    const loginBody = JSON.parse(login.body) as {
      data: {
        accessToken: string;
        user: {
          id: string;
          email: string;
          role: string;
        };
      };
    };

    expect(loginBody.data.user).toEqual({
      id: "11111111-1111-1111-1111-111111111111",
      email: "dev@example.com",
      role: "customer"
    });

    const claims = app.jwt.verify<{
      sub: string;
      role: string;
      token_version: number;
    }>(loginBody.data.accessToken);

    expect(claims).toMatchObject({
      sub: "11111111-1111-1111-1111-111111111111",
      role: "customer",
      token_version: 0
    });

    const unauthorized = await app.inject({
      method: "GET",
      url: "/me/library"
    });

    expect(unauthorized.statusCode).toBe(401);

    const library = await app.inject({
      method: "GET",
      url: "/me/library",
      headers: {
        authorization: `Bearer ${loginBody.data.accessToken}`
      }
    });

    expect(library.statusCode).toBe(200);
    expect(library.json()).toEqual({
      data: {
        items: []
      }
    });

    await app.close();
  });

  it("creates and starts a guest checkout session idempotently", async () => {
    const app = await createApp();
    const fetchMock = vi.fn(async () => {
      return new Response(
        JSON.stringify({
          id: "cs_test_123",
          url: "https://checkout.example/stripe/123",
          expires_at: 1772559999
        }),
        {
          status: 200,
          headers: {
            "content-type": "application/json"
          }
        }
      );
    });
    globalThis.fetch = fetchMock as typeof fetch;

    const create = await app.inject({
      method: "POST",
      url: "/checkout-sessions",
      headers: {
        "idempotency-key": "idem-1"
      },
      payload: {
        currency: "USD",
        guestEmail: "Guest@Example.com",
        items: [
          {
            productId: "00000000-0000-0000-0000-000000000001",
            quantity: 1
          }
        ]
      }
    });

    expect(create.statusCode).toBe(201);
    const createBody = JSON.parse(create.body) as {
      data: {
        checkoutSession: {
          id: string;
          state: string;
        };
        guestSecret: string;
      };
    };

    expect(createBody.data.checkoutSession).toMatchObject({
      id: "cs-1",
      state: "created"
    });
    expect(createBody.data.guestSecret.length).toBeGreaterThan(20);

    const start = await app.inject({
      method: "POST",
      url: "/checkout-sessions/cs-1/start",
      payload: {
        provider: "stripe",
        guestSecret: createBody.data.guestSecret
      }
    });

    expect(start.statusCode).toBe(200);
    expect(start.json()).toEqual({
      data: {
        checkoutSession: {
          id: "cs-1",
          state: "started",
          provider: "stripe",
          redirectUrl: "https://checkout.example/stripe/123",
          orderId: "order-1"
        }
      }
    });

    const restart = await app.inject({
      method: "POST",
      url: "/checkout-sessions/cs-1/start",
      payload: {
        provider: "stripe",
        guestSecret: createBody.data.guestSecret
      }
    });

    expect(restart.statusCode).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await app.close();
  });
});
