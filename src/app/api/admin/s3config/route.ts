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

  const items = await db.s3Config.findMany({ orderBy: { id: "asc" } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (authCheck(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { label, bucket, region, accessKeyId, secretAccessKey, endpoint, isDefault } = await req.json();
  const config = await db.s3Config.create({
    data: { label, bucket, region, accessKeyId, secretAccessKey, endpoint: endpoint || null, isDefault: !!isDefault },
  });
  return NextResponse.json(config, { status: 201 });
}
