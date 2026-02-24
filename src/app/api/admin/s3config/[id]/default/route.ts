import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

type Params = { params: { id: string } };

export async function PUT(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session || (session as import("next-auth").Session).user.role !== "Admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await db.$transaction([
    db.s3Config.updateMany({ data: { isDefault: false } }),
    db.s3Config.update({ where: { id: Number(params.id) }, data: { isDefault: true } }),
  ]);

  return NextResponse.json({ ok: true });
}
