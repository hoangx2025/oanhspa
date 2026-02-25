import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

function authCheck(session: import("next-auth").Session | null): boolean {
  return !session || session.user.role !== "Admin";
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (authCheck(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const units = await db.unit.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(units);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (authCheck(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "Tên đơn vị không được để trống" }, { status: 400 });

  try {
    const unit = await db.unit.create({ data: { name: name.trim() } });
    return NextResponse.json(unit, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Đơn vị đã tồn tại" }, { status: 409 });
  }
}
