// Test Turso connection
// Usage: node --env-file=.env prisma/test-turso.mjs

import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

console.log("URL:", url);
console.log("Token:", authToken ? authToken.slice(0, 20) + "..." : "MISSING");

const client = createClient({ url, authToken });

// Test 1: create a test table
console.log("\n--- Test 1: CREATE TABLE ---");
try {
  await client.execute("CREATE TABLE IF NOT EXISTS _test_connection (id INTEGER PRIMARY KEY, msg TEXT)");
  console.log("OK: Table created");
} catch (e) {
  console.error("FAIL:", e.message);
}

// Test 2: insert
console.log("\n--- Test 2: INSERT ---");
try {
  await client.execute("INSERT INTO _test_connection (id, msg) VALUES (1, 'hello turso')");
  console.log("OK: Row inserted");
} catch (e) {
  console.error("FAIL:", e.message);
}

// Test 3: select
console.log("\n--- Test 3: SELECT ---");
try {
  const result = await client.execute("SELECT * FROM _test_connection");
  console.log("OK: Rows =", result.rows);
} catch (e) {
  console.error("FAIL:", e.message);
}

// Test 4: list all tables
console.log("\n--- Test 4: LIST TABLES ---");
try {
  const result = await client.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  console.log("Tables:", result.rows.map(r => r.name));
} catch (e) {
  console.error("FAIL:", e.message);
}

// Cleanup test table
await client.execute("DROP TABLE IF EXISTS _test_connection");
console.log("\nCleanup done.");
client.close();
