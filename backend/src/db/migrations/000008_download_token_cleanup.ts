import type { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    alter table checkout_sessions
    add column if not exists guest_download_token_hash text
  `);

  pgm.sql(`
    alter table download_tokens
    drop column if exists consumed_at
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    alter table download_tokens
    add column if not exists consumed_at timestamp with time zone
  `);

  pgm.sql(`
    alter table checkout_sessions
    drop column if exists guest_download_token_hash
  `);
}
