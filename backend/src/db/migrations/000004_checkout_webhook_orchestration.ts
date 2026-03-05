import type { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createType("guest_purchase_claim_status", ["pending", "claimed", "expired", "revoked"]);

  pgm.addColumns("checkout_sessions", {
    identity_key: {
      type: "text"
    },
    guest_email: {
      type: "varchar(255)"
    },
    guest_secret_hash: {
      type: "text"
    },
    provider_checkout_url: {
      type: "text"
    },
    started_at: {
      type: "timestamp with time zone"
    },
    completed_at: {
      type: "timestamp with time zone"
    },
    expires_at: {
      type: "timestamp with time zone"
    }
  });

  pgm.sql(`
    update checkout_sessions
    set identity_key = 'u:' || user_id::text
    where identity_key is null and user_id is not null
  `);

  pgm.alterColumn("checkout_sessions", "identity_key", {
    type: "text",
    notNull: true
  });

  pgm.alterColumn("checkout_sessions", "user_id", {
    type: "uuid",
    notNull: false
  });

  pgm.dropIndex("checkout_sessions", ["user_id", "client_idempotency_key"], {
    name: "checkout_sessions_user_id_client_idempotency_key_key"
  });

  pgm.createIndex("checkout_sessions", ["identity_key", "client_idempotency_key"], {
    unique: true,
    where: "client_idempotency_key is not null",
    name: "checkout_sessions_identity_key_client_idempotency_key_key"
  });

  pgm.createIndex("checkout_sessions", ["identity_key", "created_at"], {
    name: "checkout_sessions_identity_key_created_at_idx"
  });

  pgm.addConstraint("checkout_sessions", "checkout_sessions_identity_source_check", {
    check:
      "((user_id is not null and guest_email is null and guest_secret_hash is null) or (user_id is null and guest_email is not null and guest_secret_hash is not null))"
  });

  pgm.addColumns("orders", {
    identity_key: {
      type: "text"
    },
    guest_email: {
      type: "varchar(255)"
    }
  });

  pgm.sql(`
    update orders
    set identity_key = 'u:' || user_id::text
    where identity_key is null and user_id is not null
  `);

  pgm.alterColumn("orders", "identity_key", {
    type: "text",
    notNull: true
  });

  pgm.alterColumn("orders", "user_id", {
    type: "uuid",
    notNull: false
  });

  pgm.createIndex("orders", ["identity_key", "created_at"], {
    name: "orders_identity_key_created_at_idx"
  });

  pgm.addConstraint("orders", "orders_identity_source_check", {
    check: "((user_id is not null and guest_email is null) or (user_id is null and guest_email is not null))"
  });

  pgm.addColumns("webhook_events", {
    processing_result: {
      type: "jsonb",
      notNull: true,
      default: pgm.func(`'{}'::jsonb`)
    },
    provider_created_at: {
      type: "timestamp with time zone"
    }
  });

  pgm.createTable("guest_purchase_claims", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()")
    },
    order_id: {
      type: "uuid",
      notNull: true,
      references: "orders",
      onDelete: "RESTRICT",
      unique: true
    },
    guest_email: {
      type: "varchar(255)",
      notNull: true
    },
    claim_token_hash: {
      type: "text",
      notNull: true
    },
    status: {
      type: "guest_purchase_claim_status",
      notNull: true,
      default: "pending"
    },
    expires_at: {
      type: "timestamp with time zone",
      notNull: true
    },
    claimed_by_user_id: {
      type: "uuid",
      references: "users",
      onDelete: "RESTRICT"
    },
    claimed_at: {
      type: "timestamp with time zone"
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
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("guest_purchase_claims");
  pgm.dropColumns("webhook_events", ["processing_result", "provider_created_at"]);
  pgm.dropConstraint("orders", "orders_identity_source_check");
  pgm.dropIndex("orders", ["identity_key", "created_at"], {
    name: "orders_identity_key_created_at_idx"
  });
  pgm.dropColumns("orders", ["identity_key", "guest_email"]);
  pgm.dropConstraint("checkout_sessions", "checkout_sessions_identity_source_check");
  pgm.dropIndex("checkout_sessions", ["identity_key", "created_at"], {
    name: "checkout_sessions_identity_key_created_at_idx"
  });
  pgm.dropIndex("checkout_sessions", ["identity_key", "client_idempotency_key"], {
    name: "checkout_sessions_identity_key_client_idempotency_key_key"
  });
  pgm.alterColumn("orders", "user_id", {
    type: "uuid",
    notNull: true
  });
  pgm.createIndex("checkout_sessions", ["user_id", "client_idempotency_key"], {
    unique: true,
    where: "client_idempotency_key is not null",
    name: "checkout_sessions_user_id_client_idempotency_key_key"
  });
  pgm.alterColumn("checkout_sessions", "user_id", {
    type: "uuid",
    notNull: true
  });
  pgm.dropColumns("checkout_sessions", [
    "identity_key",
    "guest_email",
    "guest_secret_hash",
    "provider_checkout_url",
    "started_at",
    "completed_at",
    "expires_at"
  ]);
  pgm.dropType("guest_purchase_claim_status");
}
