import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session as import("next-auth").Session).user.role !== "Admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { url, name, mimeType } = await req.json();
  if (!url) return NextResponse.json({ error: "url required" }, { status: 400 });

  const file = await db.file.upsert({
    where: { url },
    update: {},
    create: { url, name: name || url.split("/").pop() || null, mimeType: mimeType || null, kind: "IMAGE" },
  });

  return NextResponse.json(file, { status: 201 });
}
