import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

function authCheck(session: import("next-auth").Session | null): boolean {
  return !session || session.user.role !== "Admin";
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (authCheck(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const users = await db.aspNetUsers.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, email: true, userName: true, emailConfirmed: true,
      createdAt: true, lockoutEnabled: true,
      userRoles: { include: { role: { select: { name: true } } } },
    },
  });

  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (authCheck(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { email, password, role } = await req.json();
  if (!email || !password) return NextResponse.json({ error: "Email and password required" }, { status: 400 });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.aspNetUsers.create({
    data: {
      email, userName: email,
      normalizedEmail: email.toUpperCase(),
      normalizedUserName: email.toUpperCase(),
      emailConfirmed: true,
      passwordHash,
      securityStamp: crypto.randomUUID(),
      concurrencyStamp: crypto.randomUUID(),
    },
  });

  if (role) {
    const roleRecord = await db.aspNetRoles.findFirst({ where: { name: role } });
    if (roleRecord) {
      await db.aspNetUserRoles.create({ data: { userId: user.id, roleId: roleRecord.id } });
    }
  }

  return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
}
