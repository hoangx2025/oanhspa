// Push Prisma schema to Turso cloud database
// Usage: node --env-file=.env prisma/push-turso.mjs

import { execSync } from "child_process";
import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error("Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN in .env");
  process.exit(1);
}

// Generate SQL from Prisma schema
console.log("Generating migration SQL from schema...\n");
const sql = execSync(
  "npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script",
  { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] }
);

console.log(`SQL length: ${sql.length} chars`);
console.log("--- First 500 chars of SQL ---");
console.log(sql.slice(0, 500));
console.log("--- End preview ---\n");

if (sql.trim().length === 0) {
  console.error("ERROR: No SQL generated! Check prisma schema.");
  process.exit(1);
}

// Remove PRAGMA statements (not supported by Turso)
const cleanSql = sql
  .split("\n")
  .filter((line) => !line.trim().startsWith("PRAGMA"))
  .join("\n");

console.log("Connecting to Turso:", url);
const client = createClient({ url, authToken });

// Execute all statements at once
console.log("Executing migration...\n");
try {
  await client.executeMultiple(cleanSql);
  console.log("Migration executed successfully!");
} catch (e) {
  console.error("Migration error:", e.message);
}

// Verify: list all tables
console.log("\n--- Tables in Turso ---");
const result = await client.execute(
  "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
);
console.log("Count:", result.rows.length);
result.rows.forEach((r) => console.log(" -", r.name));

client.close();
