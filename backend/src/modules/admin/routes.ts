import { randomUUID } from "node:crypto";
import { getBuildInfo } from "../../config/build.js";
import { getEnv } from "../../config/env.js";
import { checkDatabaseConnection } from "../../db/queries/health.js";
import { appendAuditLog } from "../../db/repositories/audit-logs.js";
import { attachProductFile } from "../../db/repositories/product-files.js";
import { createProduct, updateProduct } from "../../db/repositories/products.js";
import {
  createUploadSession,
  findUploadSessionById,
  updateUploadSessionStatus
} from "../../db/repositories/upload-sessions.js";
import { HttpError } from "../../lib/http/exceptions.js";
import { incrementMetric } from "../../lib/metrics/index.js";
import { formatSuccessResponse } from "../../lib/http/response.js";
import type { FastifyPluginAsync } from "fastify";

type CreateProductBody = {
  slug: string;
  title: string;
  description: string;
  isActive: boolean;
  priceCents: number;
  currency: string;
};

type PatchProductBody = Partial<CreateProductBody>;

type InitiateUploadBody = {
  contentType: string;
  byteSize: number;
  checksumSha256?: string;
};

type CompleteUploadBody = {
  uploadSessionId: string;
};

type AttachFileBody = {
  uploadSessionId: string;
  kind: string;
  displayName: string;
  mimeType: string;
  byteSize: number;
  checksumSha256?: string;
};

const allowedContentTypes = new Set(["application/pdf", "application/epub+zip"]);
const maxUploadBytes = 209_715_200;

function createUploadStorageKey(): string {
  const now = new Date();
  const year = String(now.getUTCFullYear());
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");

  return `products/uploads/${year}/${month}/${randomUUID()}`;
}

export const adminRoutes: FastifyPluginAsync = async (app) => {
  const buildInfo = getBuildInfo();

  app.get("/health", async () => {
    return formatSuccessResponse({
      status: "ok",
      version: buildInfo.version,
      build: buildInfo.build
    });
  });

  app.get("/ready", async (_request, reply) => {
    try {
      await checkDatabaseConnection(app.db);
      await app.storage.checkConnectivity();
    } catch (error) {
      incrementMetric("readiness.failure.count", {
        component: "application"
      });
      throw new HttpError(
        503,
        "SERVICE_NOT_READY",
        error instanceof Error ? error.message : "Service dependencies are not ready"
      );
    }

    return reply.send(
      formatSuccessResponse({
        status: "ready",
        checks: {
          database: "ok",
          storage: "ok"
        }
      })
    );
  });

  app.post<{ Body: CreateProductBody }>(
    "/admin/products",
    {
      preHandler: app.requireAdmin
    },
    async (request, reply) => {
      const product = await createProduct(app.db, request.body);

      await appendAuditLog(app.db, {
        actorUserId: request.user.sub,
        entityType: "product",
        entityId: product.id,
        action: "admin_product_created",
        metadata: {
          productId: product.id
        }
      });

      return reply.code(201).send(formatSuccessResponse({ product }));
    }
  );

  app.patch<{ Params: { id: string }; Body: PatchProductBody }>(
    "/admin/products/:id",
    {
      preHandler: app.requireAdmin
    },
    async (request) => {
      const product = await updateProduct(app.db, request.params.id, request.body);

      if (!product) {
        throw new HttpError(404, "PRODUCT_NOT_FOUND", "Product not found");
      }

      await appendAuditLog(app.db, {
        actorUserId: request.user.sub,
        entityType: "product",
        entityId: product.id,
        action: "admin_product_updated",
        metadata: {
          productId: product.id
        }
      });

      return formatSuccessResponse({ product });
    }
  );

  app.post<{ Body: InitiateUploadBody }>(
    "/admin/uploads/initiate",
    {
      preHandler: app.requireAdmin
    },
    async (request, reply) => {
      if (!allowedContentTypes.has(request.body.contentType)) {
        throw new HttpError(400, "UPLOAD_INVALID_CONTENT_TYPE", "Unsupported upload content type");
      }

      if (request.body.byteSize > maxUploadBytes) {
        throw new HttpError(400, "UPLOAD_TOO_LARGE", "Upload exceeds the maximum size");
      }

      const env = getEnv();
      const storageKey = createUploadStorageKey();
      const expiresAt = new Date(Date.now() + env.UPLOAD_URL_TTL_SECONDS * 1000);
      const session = await createUploadSession(app.db, {
        createdByUserId: request.user.sub,
        storageKey,
        contentType: request.body.contentType,
        expectedSize: request.body.byteSize,
        ...(request.body.checksumSha256 ? { checksumSha256: request.body.checksumSha256 } : {}),
        expiresAt
      });
      const signedUpload = await app.storage.getSignedPutUrl(
        storageKey,
        request.body.contentType,
        env.UPLOAD_URL_TTL_SECONDS
      );

      await appendAuditLog(app.db, {
        actorUserId: request.user.sub,
        entityType: "upload_session",
        entityId: session.id,
        action: "admin_upload_initiated",
        metadata: {
          uploadSessionId: session.id
        }
      });

      return reply.code(201).send(
        formatSuccessResponse({
          uploadSession: {
            id: session.id,
            expiresAt: expiresAt.toISOString(),
            contentType: session.content_type,
            byteSize: Number(session.expected_size)
          },
          upload: {
            url: signedUpload.url,
            headers: signedUpload.headers
          }
        })
      );
    }
  );

  app.post<{ Body: CompleteUploadBody }>(
    "/admin/uploads/complete",
    {
      preHandler: app.requireAdmin
    },
    async (request) => {
      const session = await findUploadSessionById(app.db, request.body.uploadSessionId);

      if (!session) {
        throw new HttpError(404, "UPLOAD_SESSION_NOT_FOUND", "Upload session not found");
      }

      if (session.status === "completed" || session.status === "canceled") {
        throw new HttpError(409, "UPLOAD_SESSION_INVALID", "Upload session cannot be completed");
      }

      if (session.expires_at.getTime() <= Date.now()) {
        await updateUploadSessionStatus(app.db, session.id, "expired");
        throw new HttpError(409, "UPLOAD_SESSION_EXPIRED", "Upload session has expired");
      }

      const head = await app.storage.headObject(session.storage_key);

      if (!head.exists) {
        throw new HttpError(400, "UPLOAD_OBJECT_MISSING", "Uploaded object was not found");
      }

      if (head.contentType && head.contentType !== session.content_type) {
        throw new HttpError(400, "UPLOAD_CONTENT_TYPE_MISMATCH", "Uploaded object content type did not match");
      }

      if (head.size !== undefined && head.size !== Number(session.expected_size)) {
        throw new HttpError(400, "UPLOAD_SIZE_MISMATCH", "Uploaded object size did not match");
      }

      await updateUploadSessionStatus(app.db, session.id, "completed", new Date());
      await appendAuditLog(app.db, {
        actorUserId: request.user.sub,
        entityType: "upload_session",
        entityId: session.id,
        action: "admin_upload_completed",
        metadata: {
          uploadSessionId: session.id
        }
      });

      return formatSuccessResponse({
        uploadSession: {
          id: session.id,
          status: "completed",
          storageObjectVerified: true
        }
      });
    }
  );

  app.post<{ Params: { id: string }; Body: AttachFileBody }>(
    "/admin/products/:id/files",
    {
      preHandler: app.requireAdmin
    },
    async (request, reply) => {
      const session = await findUploadSessionById(app.db, request.body.uploadSessionId);

      if (!session) {
        throw new HttpError(404, "UPLOAD_SESSION_NOT_FOUND", "Upload session not found");
      }

      if (session.status !== "completed" || session.expires_at.getTime() <= Date.now()) {
        throw new HttpError(409, "UPLOAD_SESSION_INVALID", "Upload session is not ready to attach");
      }

      if (
        request.body.mimeType !== session.content_type ||
        request.body.byteSize !== Number(session.expected_size)
      ) {
        throw new HttpError(400, "UPLOAD_METADATA_MISMATCH", "File metadata did not match the verified upload");
      }

      const file = await attachProductFile(app.db, {
        productId: request.params.id,
        kind: request.body.kind,
        displayName: request.body.displayName,
        mimeType: request.body.mimeType,
        byteSize: request.body.byteSize,
        storageKey: session.storage_key,
        ...(request.body.checksumSha256 ? { checksumSha256: request.body.checksumSha256 } : {})
      });

      await appendAuditLog(app.db, {
        actorUserId: request.user.sub,
        entityType: "product_file",
        entityId: file.id,
        action: "admin_product_file_attached",
        metadata: {
          productId: request.params.id,
          uploadSessionId: session.id,
          kind: file.kind
        }
      });

      return reply.code(201).send(
        formatSuccessResponse({
          file: {
            id: file.id,
            productId: file.product_id,
            kind: file.kind,
            displayName: file.display_name,
            mimeType: file.mime_type,
            byteSize: Number(file.byte_size),
            checksumSha256: file.checksum_sha256
          }
        })
      );
    }
  );
};
