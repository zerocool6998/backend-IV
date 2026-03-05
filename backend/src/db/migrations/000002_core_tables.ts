import type { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createType("provider_type", ["stripe", "paddle"]);
  pgm.createType("checkout_session_state", [
    "draft",
    "created",
    "started",
    "completed",
    "expired",
    "canceled"
  ]);
  pgm.createType("order_status", [
    "pending",
    "paid",
    "failed",
    "canceled",
    "refunded",
    "disputed"
  ]);
  pgm.createType("payment_status", [
    "pending",
    "paid",
    "failed",
    "refunded",
    "disputed",
    "canceled"
  ]);
  pgm.createType("webhook_processing_status", [
    "received",
    "processed",
    "ignored",
    "failed"
  ]);

  pgm.createTable("products", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()")
    },
    slug: {
      type: "varchar(128)",
      notNull: true,
      unique: true
    },
    title: {
      type: "varchar(255)",
      notNull: true
    },
    description: {
      type: "text",
      notNull: true,
      default: ""
    },
    is_active: {
      type: "boolean",
      notNull: true,
      default: false
    },
    price_cents: {
      type: "integer",
      notNull: true
    },
    currency: {
      type: "char(3)",
      notNull: true,
      default: "USD"
    },
    created_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("current_timestamp")
    },
    updated_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("current_timestamp")
    }
  });

  pgm.createTable("product_files", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()")
    },
    product_id: {
      type: "uuid",
      notNull: true,
      references: "products",
      onDelete: "RESTRICT"
    },
    kind: {
      type: "varchar(32)",
      notNull: true
    },
    display_name: {
      type: "varchar(255)",
      notNull: true
    },
    mime_type: {
      type: "varchar(127)",
      notNull: true
    },
    byte_size: {
      type: "bigint",
      notNull: true
    },
    storage_key: {
      type: "text",
      notNull: true
    },
    checksum_sha256: {
      type: "varchar(64)"
    },
    created_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("current_timestamp")
    },
    updated_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("current_timestamp")
    }
  });
  pgm.createIndex("product_files", ["product_id", "kind"], {
    unique: true,
    name: "product_files_product_id_kind_key"
  });
  pgm.createIndex("product_files", ["product_id"], {
    name: "product_files_product_id_idx"
  });

  pgm.createTable("checkout_sessions", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()")
    },
    user_id: {
      type: "uuid",
      notNull: true,
      references: "users",
      onDelete: "RESTRICT"
    },
    client_idempotency_key: {
      type: "varchar(255)"
    },
    provider: {
      type: "provider_type"
    },
    provider_session_id: {
      type: "varchar(255)"
    },
    currency: {
      type: "char(3)",
      notNull: true,
      default: "USD"
    },
    subtotal_cents: {
      type: "integer",
      notNull: true,
      default: 0
    },
    discount_cents: {
      type: "integer",
      notNull: true,
      default: 0
    },
    tax_cents: {
      type: "integer",
      notNull: true,
      default: 0
    },
    total_cents: {
      type: "integer",
      notNull: true,
      default: 0
    },
    state: {
      type: "checkout_session_state",
      notNull: true,
      default: "draft"
    },
    created_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("current_timestamp")
    },
    updated_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("current_timestamp")
    }
  });
  pgm.createIndex("checkout_sessions", ["user_id", "client_idempotency_key"], {
    unique: true,
    where: "client_idempotency_key is not null",
    name: "checkout_sessions_user_id_client_idempotency_key_key"
  });
  pgm.createIndex("checkout_sessions", ["provider", "provider_session_id"], {
    unique: true,
    where: "provider is not null and provider_session_id is not null",
    name: "checkout_sessions_provider_provider_session_id_key"
  });

  pgm.createTable("checkout_session_items", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()")
    },
    checkout_session_id: {
      type: "uuid",
      notNull: true,
      references: "checkout_sessions",
      onDelete: "CASCADE"
    },
    product_id: {
      type: "uuid",
      notNull: true,
      references: "products",
      onDelete: "RESTRICT"
    },
    unit_amount_cents: {
      type: "integer",
      notNull: true
    },
    quantity: {
      type: "integer",
      notNull: true,
      default: 1
    },
    created_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("current_timestamp")
    }
  });
  pgm.createIndex("checkout_session_items", ["checkout_session_id", "product_id"], {
    unique: true,
    name: "checkout_session_items_checkout_session_id_product_id_key"
  });
  pgm.createIndex("checkout_session_items", ["checkout_session_id"], {
    name: "checkout_session_items_checkout_session_id_idx"
  });
  pgm.addConstraint("checkout_session_items", "checkout_session_items_quantity_positive", {
    check: "quantity > 0"
  });

  pgm.createTable("orders", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()")
    },
    user_id: {
      type: "uuid",
      notNull: true,
      references: "users",
      onDelete: "RESTRICT"
    },
    checkout_session_id: {
      type: "uuid",
      notNull: true,
      references: "checkout_sessions",
      onDelete: "RESTRICT",
      unique: true
    },
    currency: {
      type: "char(3)",
      notNull: true
    },
    subtotal_cents: {
      type: "integer",
      notNull: true
    },
    discount_cents: {
      type: "integer",
      notNull: true,
      default: 0
    },
    tax_cents: {
      type: "integer",
      notNull: true,
      default: 0
    },
    total_cents: {
      type: "integer",
      notNull: true
    },
    status: {
      type: "order_status",
      notNull: true,
      default: "pending"
    },
    created_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("current_timestamp")
    },
    updated_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("current_timestamp")
    }
  });
  pgm.createIndex("orders", ["user_id", "created_at"], {
    name: "orders_user_id_created_at_idx"
  });

  pgm.createTable("payments", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()")
    },
    order_id: {
      type: "uuid",
      notNull: true,
      references: "orders",
      onDelete: "RESTRICT"
    },
    provider: {
      type: "provider_type",
      notNull: true
    },
    provider_payment_id: {
      type: "varchar(255)",
      notNull: true
    },
    provider_session_id: {
      type: "varchar(255)"
    },
    status: {
      type: "payment_status",
      notNull: true
    },
    amount_cents: {
      type: "integer",
      notNull: true
    },
    currency: {
      type: "char(3)",
      notNull: true
    },
    created_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("current_timestamp")
    },
    updated_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("current_timestamp")
    }
  });
  pgm.createIndex("payments", ["provider", "provider_payment_id"], {
    unique: true,
    name: "payments_provider_provider_payment_id_key"
  });
  pgm.createIndex("payments", ["order_id"], {
    name: "payments_order_id_idx"
  });

  pgm.createTable("entitlements", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()")
    },
    user_id: {
      type: "uuid",
      notNull: true,
      references: "users",
      onDelete: "RESTRICT"
    },
    product_id: {
      type: "uuid",
      notNull: true,
      references: "products",
      onDelete: "RESTRICT"
    },
    order_id: {
      type: "uuid",
      notNull: true,
      references: "orders",
      onDelete: "RESTRICT"
    },
    grant_reason: {
      type: "varchar(64)",
      notNull: true,
      default: "purchase"
    },
    created_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("current_timestamp")
    }
  });
  pgm.createIndex("entitlements", ["user_id", "product_id"], {
    unique: true,
    name: "entitlements_user_id_product_id_key"
  });
  pgm.createIndex("entitlements", ["user_id", "created_at"], {
    name: "entitlements_user_id_created_at_idx"
  });

  pgm.createTable("webhook_events", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()")
    },
    provider: {
      type: "provider_type",
      notNull: true
    },
    provider_event_id: {
      type: "varchar(255)",
      notNull: true
    },
    event_type: {
      type: "varchar(128)",
      notNull: true
    },
    correlation_id: {
      type: "uuid",
      references: "checkout_sessions",
      onDelete: "RESTRICT"
    },
    payload: {
      type: "jsonb",
      notNull: true
    },
    status: {
      type: "webhook_processing_status",
      notNull: true,
      default: "received"
    },
    received_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("current_timestamp")
    },
    processed_at: {
      type: "timestamp with time zone"
    },
    last_error: {
      type: "text"
    }
  });
  pgm.createIndex("webhook_events", ["provider", "provider_event_id"], {
    unique: true,
    name: "webhook_events_provider_provider_event_id_key"
  });
  pgm.createIndex("webhook_events", ["provider", "status"], {
    name: "webhook_events_provider_status_idx"
  });
  pgm.createIndex("webhook_events", ["correlation_id"], {
    name: "webhook_events_correlation_id_idx"
  });

  pgm.createTable("audit_logs", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()")
    },
    actor_user_id: {
      type: "uuid",
      references: "users",
      onDelete: "RESTRICT"
    },
    entity_type: {
      type: "text",
      notNull: true
    },
    entity_id: {
      type: "text",
      notNull: true
    },
    action: {
      type: "varchar(64)",
      notNull: true
    },
    metadata: {
      type: "jsonb",
      notNull: true,
      default: pgm.func(`'{}'::jsonb`)
    },
    created_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("current_timestamp")
    }
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("audit_logs");
  pgm.dropTable("webhook_events");
  pgm.dropTable("entitlements");
  pgm.dropTable("payments");
  pgm.dropTable("orders");
  pgm.dropTable("checkout_session_items");
  pgm.dropTable("checkout_sessions");
  pgm.dropTable("product_files");
  pgm.dropTable("products");
  pgm.dropType("webhook_processing_status");
  pgm.dropType("payment_status");
  pgm.dropType("order_status");
  pgm.dropType("checkout_session_state");
  pgm.dropType("provider_type");
}
