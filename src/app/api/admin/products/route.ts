import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

function authCheck(session: import("next-auth").Session | null): boolean {
  return !session || session.user.role !== "Admin";
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (authCheck(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const limit = 20;

  const where = q ? { title: { contains: q } } : {};
  const [total, items] = await Promise.all([
    db.product.count({ where }),
    db.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        brand: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } },
        _count: { select: { variants: true, images: true } },
      },
    }),
  ]);

  return NextResponse.json({ items, total, page, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (authCheck(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    handle, title, short, description, imageHint, isHot, isBest,
    flashSaleEndsAt, youtubeUrl, brandId, categoryId,
    variants = [], images = [], marketplaces = [],
  } = body;

  const product = await db.$transaction(async (tx: Prisma.TransactionClient) => {
    const created = await tx.product.create({
      data: {
        handle, title, short, description, imageHint,
        isHot: !!isHot, isBest: !!isBest,
        flashSaleEndsAt: flashSaleEndsAt ? new Date(flashSaleEndsAt) : null,
        youtubeUrl: youtubeUrl || null,
        brandId: Number(brandId), categoryId: Number(categoryId),
      },
    });

    if (variants.length) {
      await tx.variant.createMany({
        data: variants.map((v: { name: string; value: string; price: number; compareAt?: number; stock?: number; sku?: string }, i: number) => ({
          productId: created.id,
          name: v.name, value: v.value,
          price: Number(v.price), compareAt: v.compareAt ? Number(v.compareAt) : null,
          stock: Number(v.stock ?? 0), sku: v.sku || null, sortOrder: i,
        })),
      });
    }

    for (let i = 0; i < images.length; i++) {
      const img = images[i] as { fileId: number; alt?: string };
      await tx.productImage.create({
        data: { productId: created.id, fileId: Number(img.fileId), sortOrder: i, alt: img.alt || null },
      });
    }

    for (let i = 0; i < marketplaces.length; i++) {
      const m = marketplaces[i] as { platform: string; productUrl: string };
      await tx.marketplaceLink.create({
        data: { productId: created.id, platform: m.platform, productUrl: m.productUrl, sortOrder: i },
      });
    }

    return created;
  });

  revalidatePath("/admin/products");

  return NextResponse.json(product, { status: 201 });
}
