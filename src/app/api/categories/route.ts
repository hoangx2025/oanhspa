import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const categories = await db.category.findMany({
    select: { name: true, slug: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(categories, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" },
  });
}
