import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

type Params = { params: { id: string } };

function authCheck(session: import("next-auth").Session | null): boolean {
  return !session || session.user.role !== "Admin";
}

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (authCheck(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.aspNetUsers.findUnique({
    where: { id: params.id },
    include: { userRoles: { include: { role: true } } },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { passwordHash, ...safe } = user;
  return NextResponse.json(safe);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (authCheck(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { email, password, role } = await req.json();
  const data: Record<string, unknown> = {};
  if (email) {
    data.email = email;
    data.userName = email;
    data.normalizedEmail = email.toUpperCase();
    data.normalizedUserName = email.toUpperCase();
  }
  if (password) data.passwordHash = await bcrypt.hash(password, 10);

  const user = await db.aspNetUsers.update({ where: { id: params.id }, data });

  if (role !== undefined) {
    await db.aspNetUserRoles.deleteMany({ where: { userId: params.id } });
    if (role) {
      const roleRecord = await db.aspNetRoles.findFirst({ where: { name: role } });
      if (roleRecord) {
        await db.aspNetUserRoles.create({ data: { userId: params.id, roleId: roleRecord.id } });
      }
    }
  }

  return NextResponse.json({ id: user.id, email: user.email });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (authCheck(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db.aspNetUsers.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
