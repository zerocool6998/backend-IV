import { createHash, createHmac } from "node:crypto";
import type { Env } from "../../config/env.js";

export type SignedGetUrlResult = {
  url: string;
  expiresAt: Date;
};

export type SignedPutUrlResult = {
  url: string;
  expiresAt: Date;
  headers: Record<string, string>;
};

export type HeadObjectResult = {
  exists: boolean;
  size?: number;
  contentType?: string;
  etag?: string;
};

export type StorageService = {
  getSignedGetUrl: (key: string, expiresInSeconds: number) => Promise<SignedGetUrlResult>;
  getSignedPutUrl: (
    key: string,
    contentType: string,
    expiresInSeconds: number
  ) => Promise<SignedPutUrlResult>;
  headObject: (key: string) => Promise<HeadObjectResult>;
  checkConnectivity: () => Promise<void>;
};

function sha256Hex(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function hmac(key: Buffer | string, value: string): Buffer {
  return createHmac("sha256", key).update(value).digest();
}

function encodePathSegment(segment: string): string {
  return encodeURIComponent(segment).replace(/[!'()*]/g, (char) =>
    `%${char.charCodeAt(0).toString(16).toUpperCase()}`
  );
}

function encodeQueryValue(value: string): string {
  return encodeURIComponent(value).replace(/[!'()*]/g, (char) =>
    `%${char.charCodeAt(0).toString(16).toUpperCase()}`
  );
}

function formatAmzDate(date: Date): { shortDate: string; longDate: string } {
  const iso = date.toISOString().replace(/[:-]|\.\d{3}/g, "");

  return {
    shortDate: iso.slice(0, 8),
    longDate: iso
  };
}

function buildCredentialScope(shortDate: string, region: string): string {
  return `${shortDate}/${region}/s3/aws4_request`;
}

function deriveSigningKey(secretAccessKey: string, shortDate: string, region: string): Buffer {
  const dateKey = hmac(`AWS4${secretAccessKey}`, shortDate);
  const regionKey = hmac(dateKey, region);
  const serviceKey = hmac(regionKey, "s3");

  return hmac(serviceKey, "aws4_request");
}

function buildEndpointParts(env: Env, key: string): {
  requestUrl: URL;
  canonicalUri: string;
  hostHeader: string;
} {
  const endpoint = new URL(env.STORAGE_ENDPOINT);
  const keyPath = key
    .split("/")
    .filter((segment) => segment.length > 0)
    .map(encodePathSegment)
    .join("/");
  const safeKeyPath = keyPath.length > 0 ? keyPath : "";

  if (env.STORAGE_FORCE_PATH_STYLE) {
    const pathPrefix = endpoint.pathname.endsWith("/")
      ? endpoint.pathname.slice(0, -1)
      : endpoint.pathname;
    const objectPath = `${pathPrefix}/${encodePathSegment(env.STORAGE_BUCKET)}${
      safeKeyPath.length > 0 ? `/${safeKeyPath}` : ""
    }`;

    endpoint.pathname = objectPath;

    return {
      requestUrl: endpoint,
      canonicalUri: objectPath,
      hostHeader: endpoint.host
    };
  }

  endpoint.hostname = `${env.STORAGE_BUCKET}.${endpoint.hostname}`;
  const pathPrefix = endpoint.pathname.endsWith("/")
    ? endpoint.pathname.slice(0, -1)
    : endpoint.pathname;
  const objectPath = `${pathPrefix}${safeKeyPath.length > 0 ? `/${safeKeyPath}` : ""}` || "/";

  endpoint.pathname = objectPath;

  return {
    requestUrl: endpoint,
    canonicalUri: objectPath,
    hostHeader: endpoint.host
  };
}

function buildCanonicalQuery(params: Record<string, string>): string {
  return Object.entries(params)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${encodeQueryValue(key)}=${encodeQueryValue(value)}`)
    .join("&");
}

function createSignedUrl(
  env: Env,
  method: "PUT",
  key: string,
  expiresInSeconds: number,
  contentType: string
): SignedPutUrlResult;
function createSignedUrl(
  env: Env,
  method: "GET" | "HEAD",
  key: string,
  expiresInSeconds: number,
  contentType?: string
): SignedGetUrlResult;
function createSignedUrl(
  env: Env,
  method: "GET" | "PUT" | "HEAD",
  key: string,
  expiresInSeconds: number,
  contentType?: string
): SignedGetUrlResult | SignedPutUrlResult {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + expiresInSeconds * 1000);
  const { shortDate, longDate } = formatAmzDate(now);
  const credentialScope = buildCredentialScope(shortDate, env.STORAGE_REGION);
  const { requestUrl, canonicalUri, hostHeader } = buildEndpointParts(env, key);
  const signedHeaders = contentType ? "content-type;host" : "host";
  const canonicalHeaders = contentType
    ? `content-type:${contentType}\nhost:${hostHeader}\n`
    : `host:${hostHeader}\n`;
  const queryParams: Record<string, string> = {
    "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
    "X-Amz-Credential": `${env.STORAGE_ACCESS_KEY_ID}/${credentialScope}`,
    "X-Amz-Date": longDate,
    "X-Amz-Expires": String(expiresInSeconds),
    "X-Amz-SignedHeaders": signedHeaders
  };

  const canonicalQuery = buildCanonicalQuery(queryParams);
  const canonicalRequest = [
    method,
    canonicalUri || "/",
    canonicalQuery,
    canonicalHeaders,
    signedHeaders,
    "UNSIGNED-PAYLOAD"
  ].join("\n");
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    longDate,
    credentialScope,
    sha256Hex(canonicalRequest)
  ].join("\n");
  const signature = createHmac(
    "sha256",
    deriveSigningKey(env.STORAGE_SECRET_ACCESS_KEY, shortDate, env.STORAGE_REGION)
  )
    .update(stringToSign)
    .digest("hex");

  queryParams["X-Amz-Signature"] = signature;
  requestUrl.search = buildCanonicalQuery(queryParams);

  if (method === "PUT") {
    return {
      url: requestUrl.toString(),
      expiresAt,
      headers: {
        "content-type": contentType ?? "application/octet-stream"
      }
    };
  }

  return {
    url: requestUrl.toString(),
    expiresAt
  };
}

export function createStorageService(env: Env): StorageService {
  const service: StorageService = {
    async getSignedGetUrl(key, expiresInSeconds) {
      return createSignedUrl(env, "GET", key, expiresInSeconds);
    },
    async getSignedPutUrl(key, contentType, expiresInSeconds) {
      return createSignedUrl(env, "PUT", key, expiresInSeconds, contentType);
    },
    async headObject(key) {
      const signed = createSignedUrl(env, "HEAD", key, 60);
      const response = await fetch(signed.url, {
        method: "HEAD"
      });

      if (response.status === 404) {
        return { exists: false };
      }

      if (!response.ok) {
        throw new Error(`Storage HEAD failed with status ${response.status}`);
      }

      const result: HeadObjectResult = {
        exists: true
      };
      const sizeHeader = response.headers.get("content-length");
      const contentType = response.headers.get("content-type");
      const etag = response.headers.get("etag");

      if (sizeHeader) {
        result.size = Number(sizeHeader);
      }

      if (contentType) {
        result.contentType = contentType;
      }

      if (etag) {
        result.etag = etag;
      }

      return result;
    },
    async checkConnectivity() {
      await service.headObject(env.STORAGE_HEALTHCHECK_KEY);
    }
  };

  return service;
}
