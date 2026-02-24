import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session as import("next-auth").Session).user.role !== "Admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [products, brands, categories, users] = await Promise.all([
    db.product.count(),
    db.brand.count(),
    db.category.count(),
    db.aspNetUsers.count(),
  ]);

  const recentProducts = await db.product.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, handle: true, title: true, createdAt: true },
  });

  return NextResponse.json({ products, brands, categories, users, recentProducts });
}
