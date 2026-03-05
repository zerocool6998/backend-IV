export type UserRole = "customer" | "admin";
export type ProviderType = "stripe" | "paddle";
export type CheckoutSessionState =
  | "draft"
  | "created"
  | "started"
  | "completed"
  | "expired"
  | "canceled";
export type OrderStatus = "pending" | "paid" | "failed" | "canceled" | "refunded" | "disputed";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded" | "disputed" | "canceled";
export type WebhookProcessingStatus = "received" | "processed" | "ignored" | "failed";
export type EntitlementStatus = "active" | "suspended" | "revoked";
export type DownloadLinkChannel = "authenticated" | "guest_token";
export type DownloadLinkOutcome = "issued" | "denied";
export type UploadSessionStatus = "initiated" | "completed" | "expired" | "canceled";

export type UserRow = {
  id: string;
  email: string;
  password_hash: string;
  role: UserRole;
  token_version: number;
  created_at: Date;
  updated_at: Date;
};

export type ProductRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  is_active: boolean;
  price_cents: number;
  currency: string;
  created_at: Date;
  updated_at: Date;
};

export type ProductFileRow = {
  id: string;
  product_id: string;
  kind: string;
  display_name: string;
  mime_type: string;
  byte_size: string | number;
  storage_key: string;
  checksum_sha256: string | null;
  created_at: Date;
  updated_at: Date;
};

export type CheckoutSessionRow = {
  id: string;
  identity_key: string;
  user_id: string | null;
  guest_email: string | null;
  guest_secret_hash: string | null;
  guest_download_token_hash: string | null;
  client_idempotency_key: string | null;
  provider: ProviderType | null;
  provider_session_id: string | null;
  provider_checkout_url: string | null;
  currency: string;
  subtotal_cents: number;
  discount_cents: number;
  tax_cents: number;
  total_cents: number;
  state: CheckoutSessionState;
  started_at: Date | null;
  completed_at: Date | null;
  expires_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

export type CheckoutSessionItemRow = {
  id: string;
  checkout_session_id: string;
  product_id: string;
  unit_amount_cents: number;
  quantity: number;
  created_at: Date;
};

export type OrderRow = {
  id: string;
  identity_key: string;
  user_id: string | null;
  guest_email: string | null;
  checkout_session_id: string;
  currency: string;
  subtotal_cents: number;
  discount_cents: number;
  tax_cents: number;
  total_cents: number;
  status: OrderStatus;
  created_at: Date;
  updated_at: Date;
};

export type PaymentRow = {
  id: string;
  order_id: string;
  provider: ProviderType;
  provider_payment_id: string;
  provider_session_id: string | null;
  status: PaymentStatus;
  amount_cents: number;
  currency: string;
  created_at: Date;
  updated_at: Date;
};

export type EntitlementRow = {
  id: string;
  user_id: string;
  product_id: string;
  first_order_id: string;
  last_order_id: string;
  status: EntitlementStatus;
  grant_reason: string;
  granted_at: Date;
  revoked_at: Date | null;
  revoked_reason: string | null;
  updated_at: Date;
  created_at: Date;
};

export type WebhookEventRow = {
  id: string;
  provider: ProviderType;
  provider_event_id: string;
  event_type: string;
  correlation_id: string | null;
  processing_result: Record<string, unknown>;
  provider_created_at: Date | null;
  payload: unknown;
  status: WebhookProcessingStatus;
  received_at: Date;
  processed_at: Date | null;
  last_error: string | null;
};

export type DownloadTokenRow = {
  id: string;
  order_id: string;
  token_hash: string;
  expires_at: Date;
  created_at: Date;
};

export type DownloadLinkEventRow = {
  id: string;
  user_id: string | null;
  order_id: string | null;
  identity_key: string | null;
  product_id: string;
  product_file_id: string | null;
  channel: DownloadLinkChannel;
  outcome: DownloadLinkOutcome;
  deny_reason: string | null;
  expires_at: Date | null;
  request_id: string | null;
  created_at: Date;
};

export type UploadSessionRow = {
  id: string;
  created_by_user_id: string;
  status: UploadSessionStatus;
  storage_key: string;
  content_type: string;
  expected_size: string | number;
  checksum_sha256: string | null;
  expires_at: Date;
  completed_at: Date | null;
  product_id: string | null;
  metadata: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
};

export type AuditLogRow = {
  id: string;
  actor_user_id: string | null;
  entity_type: string;
  entity_id: string;
  action: string;
  metadata: Record<string, unknown>;
  created_at: Date;
};
