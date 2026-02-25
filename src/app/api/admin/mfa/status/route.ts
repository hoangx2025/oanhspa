import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session as import("next-auth").Session).user.role !== "Admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.aspNetUsers.findUnique({
    where: { id: session.user.id },
    select: { twoFactorEnabled: true },
  });

  return NextResponse.json({ enabled: user?.twoFactorEnabled ?? false });
}
