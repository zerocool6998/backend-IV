import type { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createType("entitlement_status", ["active", "suspended", "revoked"]);
  pgm.createType("download_link_channel", ["authenticated", "guest_token"]);
  pgm.createType("download_link_outcome", ["issued", "denied"]);

  pgm.renameColumn("entitlements", "order_id", "first_order_id");

  pgm.addColumns("entitlements", {
    last_order_id: {
      type: "uuid",
      references: "orders",
      onDelete: "RESTRICT"
    },
    status: {
      type: "entitlement_status",
      notNull: true,
      default: "active"
    },
    granted_at: {
      type: "timestamp with time zone"
    },
    revoked_at: {
      type: "timestamp with time zone"
    },
    revoked_reason: {
      type: "text"
    },
    updated_at: {
      type: "timestamp with time zone"
    }
  });

  pgm.sql(`
    update entitlements
    set last_order_id = first_order_id,
        granted_at = created_at,
        updated_at = created_at
    where last_order_id is null
       or granted_at is null
       or updated_at is null
  `);

  pgm.alterColumn("entitlements", "last_order_id", {
    type: "uuid",
    notNull: true
  });
  pgm.alterColumn("entitlements", "granted_at", {
    type: "timestamp with time zone",
    notNull: true
  });
  pgm.alterColumn("entitlements", "updated_at", {
    type: "timestamp with time zone",
    notNull: true
  });

  pgm.createIndex("entitlements", ["user_id", "status", "updated_at"], {
    name: "entitlements_user_id_status_updated_at_idx"
  });
  pgm.createIndex("entitlements", ["last_order_id"], {
    name: "entitlements_last_order_id_idx"
  });
  pgm.createIndex("entitlements", ["first_order_id"], {
    name: "entitlements_first_order_id_idx"
  });

  pgm.createTable("download_link_events", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()")
    },
    user_id: {
      type: "uuid",
      references: "users",
      onDelete: "RESTRICT"
    },
    order_id: {
      type: "uuid",
      references: "orders",
      onDelete: "RESTRICT"
    },
    identity_key: {
      type: "text"
    },
    product_id: {
      type: "uuid",
      notNull: true,
      references: "products",
      onDelete: "RESTRICT"
    },
    product_file_id: {
      type: "uuid",
      references: "product_files",
      onDelete: "RESTRICT"
    },
    channel: {
      type: "download_link_channel",
      notNull: true
    },
    outcome: {
      type: "download_link_outcome",
      notNull: true
    },
    deny_reason: {
      type: "text"
    },
    expires_at: {
      type: "timestamp with time zone"
    },
    request_id: {
      type: "text"
    },
    created_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("current_timestamp")
    }
  });
  pgm.createIndex("download_link_events", ["identity_key", "product_id", "created_at"], {
    name: "download_link_events_identity_key_product_id_created_at_idx"
  });
  pgm.createIndex("download_link_events", ["outcome", "created_at"], {
    name: "download_link_events_outcome_created_at_idx"
  });

  pgm.createTable("download_tokens", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()")
    },
    order_id: {
      type: "uuid",
      notNull: true,
      unique: true,
      references: "orders",
      onDelete: "RESTRICT"
    },
    token_hash: {
      type: "text",
      notNull: true,
      unique: true
    },
    expires_at: {
      type: "timestamp with time zone",
      notNull: true
    },
    created_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("current_timestamp")
    }
  });

  pgm.dropTable("guest_purchase_claims");
  pgm.dropType("guest_purchase_claim_status");
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.createType("guest_purchase_claim_status", ["pending", "claimed", "expired", "revoked"]);

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
      type: "citext",
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

  pgm.dropTable("download_tokens");
  pgm.dropTable("download_link_events");

  pgm.dropIndex("entitlements", ["first_order_id"], {
    name: "entitlements_first_order_id_idx"
  });
  pgm.dropIndex("entitlements", ["last_order_id"], {
    name: "entitlements_last_order_id_idx"
  });
  pgm.dropIndex("entitlements", ["user_id", "status", "updated_at"], {
    name: "entitlements_user_id_status_updated_at_idx"
  });

  pgm.dropColumns("entitlements", [
    "last_order_id",
    "status",
    "granted_at",
    "revoked_at",
    "revoked_reason",
    "updated_at"
  ]);
  pgm.renameColumn("entitlements", "first_order_id", "order_id");

  pgm.dropType("download_link_outcome");
  pgm.dropType("download_link_channel");
  pgm.dropType("entitlement_status");
}
