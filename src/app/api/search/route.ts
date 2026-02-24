import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  if (!q) return NextResponse.json({ products: [] });

  const list = await prisma.product.findMany({
    where: { title: { contains: q } },
    take: 6,
    orderBy: { updatedAt: "desc" },
    select: { handle: true, title: true },
  });

  return NextResponse.json({ products: list });
}
