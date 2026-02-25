import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

type Params = { params: { id: string } };

function authCheck(session: import("next-auth").Session | null): boolean {
  return !session || session.user.role !== "Admin";
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (authCheck(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "Tên đơn vị không được để trống" }, { status: 400 });

  try {
    const unit = await db.unit.update({
      where: { id: Number(params.id) },
      data: { name: name.trim() },
    });
    return NextResponse.json(unit);
  } catch {
    return NextResponse.json({ error: "Đơn vị đã tồn tại hoặc không tìm thấy" }, { status: 409 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (authCheck(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db.unit.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ ok: true });
}
