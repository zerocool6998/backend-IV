import type { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createExtension("citext", { ifNotExists: true });

  pgm.alterColumn("checkout_sessions", "guest_email", {
    type: "citext"
  });

  pgm.alterColumn("orders", "guest_email", {
    type: "citext"
  });

  pgm.alterColumn("guest_purchase_claims", "guest_email", {
    type: "citext",
    notNull: true
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.alterColumn("guest_purchase_claims", "guest_email", {
    type: "varchar(255)",
    notNull: true
  });

  pgm.alterColumn("orders", "guest_email", {
    type: "varchar(255)"
  });

  pgm.alterColumn("checkout_sessions", "guest_email", {
    type: "varchar(255)"
  });

  pgm.dropExtension("citext", { ifExists: true });
}
