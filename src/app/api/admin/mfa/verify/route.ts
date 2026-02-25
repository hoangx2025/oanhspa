import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { verifySync } from "otplib";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session as import("next-auth").Session).user.role !== "Admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { code } = await req.json();
  if (!code) return NextResponse.json({ error: "Thiếu mã xác thực" }, { status: 400 });

  const userId = session.user.id;

  const tokenRecord = await db.aspNetUserTokens.findFirst({
    where: { userId, loginProvider: "Authenticator", name: "AuthenticatorKey" },
  });

  if (!tokenRecord?.value) {
    return NextResponse.json({ error: "Chưa thiết lập MFA" }, { status: 400 });
  }

  const result = verifySync({
    token: String(code).replace(/\s/g, ""),
    secret: tokenRecord.value,
  });

  if (!result.valid) {
    return NextResponse.json({ error: "Mã không đúng hoặc đã hết hạn" }, { status: 400 });
  }

  // Kích hoạt MFA
  await db.aspNetUsers.update({
    where: { id: userId },
    data: { twoFactorEnabled: true },
  });

  return NextResponse.json({ ok: true });
}
