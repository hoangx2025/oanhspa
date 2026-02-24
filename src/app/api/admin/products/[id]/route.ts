import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

type Params = { params: { id: string } };

function authCheck(session: import("next-auth").Session | null): boolean {
  return !session || session.user.role !== "Admin";
}

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (authCheck(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const product = await db.product.findUnique({
    where: { id: Number(params.id) },
    include: {
      brand: true, category: true,
      variants: { orderBy: { sortOrder: "asc" } },
      images: { include: { file: true }, orderBy: { sortOrder: "asc" } },
      marketplaces: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (authCheck(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    handle, title, short, description, imageHint, isHot, isBest,
    flashSaleEndsAt, youtubeUrl, brandId, categoryId,
    variants = [], images = [], marketplaces = [],
  } = body;

  const productId = Number(params.id);

  const product = await db.$transaction(async (tx: Prisma.TransactionClient) => {
    const updated = await tx.product.update({
      where: { id: productId },
      data: {
        handle, title, short, description, imageHint,
        isHot: !!isHot, isBest: !!isBest,
        flashSaleEndsAt: flashSaleEndsAt ? new Date(flashSaleEndsAt) : null,
        youtubeUrl: youtubeUrl || null,
        brandId: Number(brandId), categoryId: Number(categoryId),
      },
    });

    // Replace variants
    await tx.variant.deleteMany({ where: { productId } });
    if (variants.length) {
      await tx.variant.createMany({
        data: variants.map((v: { name: string; value: string; price: number; compareAt?: number; stock?: number; sku?: string }, i: number) => ({
          productId,
          name: v.name, value: v.value,
          price: Number(v.price), compareAt: v.compareAt ? Number(v.compareAt) : null,
          stock: Number(v.stock ?? 0), sku: v.sku || null, sortOrder: i,
        })),
      });
    }

    // Replace images
    await tx.productImage.deleteMany({ where: { productId } });
    for (let i = 0; i < images.length; i++) {
      const img = images[i] as { fileId: number; alt?: string };
      await tx.productImage.create({
        data: { productId, fileId: Number(img.fileId), sortOrder: i, alt: img.alt || null },
      });
    }

    // Replace marketplaces
    await tx.marketplaceLink.deleteMany({ where: { productId } });
    for (let i = 0; i < marketplaces.length; i++) {
      const m = marketplaces[i] as { platform: string; productUrl: string };
      await tx.marketplaceLink.create({
        data: { productId, platform: m.platform, productUrl: m.productUrl, sortOrder: i },
      });
    }

    return updated;
  });

  return NextResponse.json(product);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (authCheck(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db.product.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ ok: true });
}
