import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { authenticator } from "otplib";
import QRCode from "qrcode";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session || (session as import("next-auth").Session).user.role !== "Admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const email  = session.user.email ?? userId;

  // Tạo secret mới
  const secret = authenticator.generateSecret();
  const otpauthUrl = authenticator.keyuri(email, "Oanh SPA Admin", secret);
  const qrDataUrl  = await QRCode.toDataURL(otpauthUrl);

  // Lưu tạm vào AspNetUserTokens (chưa kích hoạt MFA)
  await db.aspNetUserTokens.upsert({
    where: { userId_loginProvider_name: { userId, loginProvider: "Authenticator", name: "AuthenticatorKey" } },
    create: { userId, loginProvider: "Authenticator", name: "AuthenticatorKey", value: secret },
    update: { value: secret },
  });

  return NextResponse.json({ qrDataUrl, secret });
}
