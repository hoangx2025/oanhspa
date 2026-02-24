import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

type Params = { params: { id: string } };

function authCheck(session: import("next-auth").Session | null): boolean {
  return !session || session.user.role !== "Admin";
}

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (authCheck(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const category = await db.category.findUnique({ where: { id: Number(params.id) } });
  if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(category);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (authCheck(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, slug } = await req.json();
  const category = await db.category.update({
    where: { id: Number(params.id) },
    data: { name, slug },
  });
  return NextResponse.json(category);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (authCheck(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db.category.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ ok: true });
}
