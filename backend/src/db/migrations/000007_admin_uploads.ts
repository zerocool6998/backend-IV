import type { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createType("upload_session_status", ["initiated", "completed", "expired", "canceled"]);

  pgm.createTable("upload_sessions", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()")
    },
    created_by_user_id: {
      type: "uuid",
      notNull: true,
      references: "users",
      onDelete: "RESTRICT"
    },
    status: {
      type: "upload_session_status",
      notNull: true,
      default: "initiated"
    },
    storage_key: {
      type: "text",
      notNull: true,
      unique: true
    },
    content_type: {
      type: "text",
      notNull: true
    },
    expected_size: {
      type: "bigint",
      notNull: true
    },
    checksum_sha256: {
      type: "text"
    },
    expires_at: {
      type: "timestamp with time zone",
      notNull: true
    },
    completed_at: {
      type: "timestamp with time zone"
    },
    product_id: {
      type: "uuid",
      references: "products",
      onDelete: "RESTRICT"
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
    },
    updated_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("current_timestamp")
    }
  });
  pgm.createIndex("upload_sessions", ["created_by_user_id", "created_at"], {
    name: "upload_sessions_created_by_user_id_created_at_idx"
  });
  pgm.createIndex("upload_sessions", ["status", "expires_at"], {
    name: "upload_sessions_status_expires_at_idx"
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("upload_sessions");
  pgm.dropType("upload_session_status");
}
