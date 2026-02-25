// Migrate data from local SQLite (dev.db) to Turso
// Usage: node --env-file=.env prisma/migrate-data.mjs

import { createClient } from "@libsql/client";
import Database from "better-sqlite3";
import { resolve } from "path";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error("Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN");
  process.exit(1);
}

const dbPath = resolve("prisma/dev.db");
console.log("Local DB:", dbPath);

const local = new Database(dbPath, { readonly: true });
const turso = createClient({ url, authToken });

// Insert order: parent tables first, then child tables
const tableOrder = [
  // No foreign keys
  "Brand",
  "Category",
  "Unit",
  "S3Config",
  "ShopeeShop",
  "AspNetUsers",
  "AspNetRoles",
  "File",
  // Depends on above
  "Product",
  "Variant",
  "ProductImage",
  "MarketplaceLink",
  "Order",
  "OrderItem",
  "Shipment",
  "SyncLog",
  "AspNetUserRoles",
  "AspNetUserClaims",
  "AspNetRoleClaims",
  "AspNetUserLogins",
  "AspNetUserTokens",
];

// Disable foreign keys during migration, re-enable after
await turso.execute("PRAGMA foreign_keys = OFF");

for (const table of tableOrder) {
  let rows;
  try {
    rows = local.prepare(`SELECT * FROM "${table}"`).all();
  } catch {
    console.log(`  ${table}: not found in local DB (skip)`);
    continue;
  }

  if (rows.length === 0) {
    console.log(`  ${table}: 0 rows (skip)`);
    continue;
  }

  const cols = Object.keys(rows[0]);
  const placeholders = cols.map(() => "?").join(", ");
  const colNames = cols.map((c) => `"${c}"`).join(", ");
  const insertSql = `INSERT OR IGNORE INTO "${table}" (${colNames}) VALUES (${placeholders})`;

  let inserted = 0;
  let errors = 0;
  for (const row of rows) {
    const values = cols.map((c) => row[c] ?? null);
    try {
      await turso.execute({ sql: insertSql, args: values });
      inserted++;
    } catch (e) {
      errors++;
      if (errors <= 3) {
        console.error(`    Error in ${table}:`, e.message);
      }
    }
  }
  console.log(`  ${table}: ${inserted}/${rows.length} rows migrated${errors ? ` (${errors} errors)` : ""}`);
}

await turso.execute("PRAGMA foreign_keys = ON");

console.log("\nDone! Data migrated to Turso.");
local.close();
turso.close();
