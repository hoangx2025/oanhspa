import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function createPrisma() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (url && authToken) {
    const adapter = new PrismaLibSQL({ url, authToken });
    return new PrismaClient({ adapter });
  }

  // Fallback: SQLite local
  return new PrismaClient();
}

export const prisma = globalThis.__prisma ?? createPrisma();
export const db = prisma;

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}
