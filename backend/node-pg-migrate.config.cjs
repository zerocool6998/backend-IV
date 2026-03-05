const path = require("path");
require("dotenv").config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set before running migrations.");
}

module.exports = {
  databaseUrl: process.env.DATABASE_URL,
  dir: path.join(__dirname, "src/db/migrations"),
  migrationsTable: "pgmigrations",
  schema: "public",
  createSchema: false
};