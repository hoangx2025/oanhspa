import { NextResponse } from "next/server";
import { productsByBrandSlug } from "@/lib/catalog";

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } },
) {
  const slug = params.slug;
  const products = await productsByBrandSlug(slug, 6);
  return NextResponse.json({ products });
}
