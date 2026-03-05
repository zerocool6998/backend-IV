import type { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createType("user_role", ["customer", "admin"]);

  pgm.addColumns("users", {
    role: {
      type: "user_role",
      notNull: true,
      default: "customer"
    },
    token_version: {
      type: "integer",
      notNull: true,
      default: 0
    }
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropColumns("users", ["role", "token_version"]);
  pgm.dropType("user_role");
}
