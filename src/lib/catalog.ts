import { prisma } from "@/lib/db";
import type { UnifiedProduct, ProductVariant } from "@/data/unifiedProduct";

function parseImages(imagesJson: string | null | undefined): string[] {
  try {
    const arr = JSON.parse(imagesJson || "[]");
    if (Array.isArray(arr)) return arr.filter((x) => typeof x === "string");
    return [];
  } catch {
    return [];
  }
}

function toUnified(p: any): UnifiedProduct {
  const images = parseImages(p.imagesJson);
  const variants: ProductVariant[] = (p.variants || []).map((v: any) => ({
    name: v.name,
    value: v.value,
    price: v.price ?? undefined,
    compareAtPrice: v.compareAt ?? undefined,
    sku: v.sku ?? undefined,
  }));

  return {
    id: String(p.id),
    handle: p.handle,
    title: p.title,
    brand: p.brand?.name ?? "",
    category: p.category?.name ?? "",
    price: p.price,
    compareAtPrice: p.compareAtPrice ?? undefined,
    currency: "VND",
    stockStatus: "in_stock",
    isHot: p.isHot,
    isBest: p.isBest,
    flashSaleEndsAtISO: p.flashSaleEndsAt ? new Date(p.flashSaleEndsAt).toISOString() : undefined,
    short: p.short ?? undefined,
    description: p.description ?? undefined,
    images,
    youtubeUrl: p.youtubeUrl ?? undefined,
    marketplaces: (p.marketplaces || []).map((m: any) => ({
      platform: m.platform,
      productUrl: m.productUrl,
    })),
    variants,
    imageHint: (p.imageHint as any) ?? undefined,
  };
}

export async function allProducts(): Promise<UnifiedProduct[]> {
  const list = await prisma.product.findMany({
    include: {
      brand: true,
      category: true,
      variants: { orderBy: { sortOrder: "asc" } },
      marketplaces: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: [{ isBest: "desc" }, { updatedAt: "desc" }],
  });
  return list.map(toUnified);
}

export async function productByHandle(handle: string): Promise<UnifiedProduct | null> {
  const p = await prisma.product.findUnique({
    where: { handle },
    include: {
      brand: true,
      category: true,
      variants: { orderBy: { sortOrder: "asc" } },
      marketplaces: { orderBy: { sortOrder: "asc" } },
    },
  });
  return p ? toUnified(p) : null;
}

export async function bestSellers(limit = 6): Promise<UnifiedProduct[]> {
  const list = await prisma.product.findMany({
    where: { isBest: true },
    take: limit,
    include: { brand: true, category: true, variants: true, marketplaces: true },
    orderBy: [{ updatedAt: "desc" }],
  });
  return list.map(toUnified);
}

export async function hotWeek(limit = 6): Promise<UnifiedProduct[]> {
  const list = await prisma.product.findMany({
    where: { isHot: true },
    take: limit,
    include: { brand: true, category: true, variants: true, marketplaces: true },
    orderBy: [{ updatedAt: "desc" }],
  });
  return list.map(toUnified);
}

export async function flashSaleProducts(limit = 6): Promise<UnifiedProduct[]> {
  const list = await prisma.product.findMany({
    where: { flashSaleEndsAt: { not: null } },
    take: limit,
    include: { brand: true, category: true, variants: true, marketplaces: true },
    orderBy: [{ flashSaleEndsAt: "asc" }],
  });
  return list.map(toUnified);
}

export async function brands(): Promise<{ name: string; slug: string; tagline?: string | null; heroNote?: string | null }[]> {
  const list = await prisma.brand.findMany({ orderBy: { name: "asc" } });
  return list.map((b) => ({ name: b.name, slug: b.slug, tagline: b.tagline, heroNote: b.heroNote }));
}

export async function productsByBrandSlug(brandSlug: string, limit = 6): Promise<UnifiedProduct[]> {
  const list = await prisma.product.findMany({
    where: { brand: { slug: brandSlug } },
    take: limit,
    include: { brand: true, category: true, variants: true, marketplaces: true },
    orderBy: [{ isBest: "desc" }, { updatedAt: "desc" }],
  });
  return list.map(toUnified);
}

export async function productsByCategory(categoryName: string, limit = 12): Promise<UnifiedProduct[]> {
  const list = await prisma.product.findMany({
    where: { category: { name: categoryName } },
    take: limit,
    include: { brand: true, category: true, variants: true, marketplaces: true },
    orderBy: [{ isBest: "desc" }, { updatedAt: "desc" }],
  });
  return list.map(toUnified);
}
