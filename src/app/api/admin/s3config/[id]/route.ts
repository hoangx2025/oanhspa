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

  const config = await db.s3Config.findUnique({ where: { id: Number(params.id) } });
  if (!config) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(config);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (authCheck(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { label, bucket, region, accessKeyId, secretAccessKey, endpoint, isDefault } = await req.json();
  const config = await db.s3Config.update({
    where: { id: Number(params.id) },
    data: { label, bucket, region, accessKeyId, secretAccessKey, endpoint: endpoint || null, isDefault: !!isDefault },
  });
  return NextResponse.json(config);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (authCheck(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db.s3Config.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ ok: true });
}
