import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import argon2 from "argon2";

export async function hashPassword(plainText: string): Promise<string> {
  return argon2.hash(plainText);
}

export async function verifyPassword(plainText: string, hash: string): Promise<boolean> {
  return argon2.verify(hash, plainText);
}

export function generateOpaqueSecret(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

export function createSha256Hmac(secret: string, payload: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function createSecretDigest(secret: string, key: string): string {
  return createSha256Hmac(key, secret);
}

export function safeHexCompare(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left, "hex");
  const rightBuffer = Buffer.from(right, "hex");

  if (leftBuffer.length === 0 || rightBuffer.length === 0 || leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function verifySecretDigest(secret: string, expectedDigest: string, key: string): boolean {
  return safeHexCompare(createSecretDigest(secret, key), expectedDigest);
}
