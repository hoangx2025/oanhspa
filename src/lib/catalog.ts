import { prisma } from "@/lib/db";
import type { UnifiedProduct, ProductVariant } from "@/data/unifiedProduct";

function toUnified(p: any): UnifiedProduct {
  const images: string[] = (p.images || [])
    .slice()
    .sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((x: any) => x?.file?.url)
    .filter((x: any) => typeof x === "string" && x.trim().length > 0);

  const variants: ProductVariant[] = (p.variants || []).map((v: any) => ({
    id: String(v.id),
    name: v.name,
    value: v.value,
    price: v.price,
    compareAtPrice: v.compareAt ?? undefined,
    stock: v.stock ?? 0,
    sku: v.sku ?? undefined,
  }));

  // derive a default/base price from the first variant
  const basePrice = variants[0]?.price ?? 0;
  const baseCompareAt = variants[0]?.compareAtPrice;

  return {
    id: String(p.id),
    handle: p.handle,
    title: p.title,
    brand: p.brand?.name ?? "",
    category: p.category?.name ?? "",
    price: basePrice,
    compareAtPrice: baseCompareAt,
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
      images: { include: { file: true }, orderBy: { sortOrder: "asc" } },
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
      images: { include: { file: true }, orderBy: { sortOrder: "asc" } },
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
    include: { brand: true, category: true, images: { include: { file: true }, orderBy: { sortOrder: "asc" } }, variants: true, marketplaces: true },
    orderBy: [{ updatedAt: "desc" }],
  });
  return list.map(toUnified);
}

export async function hotWeek(limit = 6): Promise<UnifiedProduct[]> {
  const list = await prisma.product.findMany({
    where: { isHot: true },
    take: limit,
    include: { brand: true, category: true, images: { include: { file: true }, orderBy: { sortOrder: "asc" } }, variants: true, marketplaces: true },
    orderBy: [{ updatedAt: "desc" }],
  });
  return list.map(toUnified);
}

export async function flashSaleProducts(limit = 6): Promise<UnifiedProduct[]> {
  const list = await prisma.product.findMany({
    where: { flashSaleEndsAt: { not: null } },
    take: limit,
    include: { brand: true, category: true, images: { include: { file: true }, orderBy: { sortOrder: "asc" } }, variants: true, marketplaces: true },
    orderBy: [{ flashSaleEndsAt: "asc" }],
  });
  return list.map(toUnified);
}

export async function brands(): Promise<{ name: string; slug: string; tagline?: string | null; heroNote?: string | null; heroImage?: string | null }[]> {
  const list = await prisma.brand.findMany({ orderBy: { name: "asc" } });
  return list.map((b) => ({ name: b.name, slug: b.slug, tagline: b.tagline, heroNote: b.heroNote, heroImage: b.heroImage }));
}

export async function productsByBrandSlug(brandSlug: string, limit = 6): Promise<UnifiedProduct[]> {
  const list = await prisma.product.findMany({
    where: { brand: { slug: brandSlug } },
    take: limit,
    include: { brand: true, category: true, images: { include: { file: true }, orderBy: { sortOrder: "asc" } }, variants: true, marketplaces: true },
    orderBy: [{ isBest: "desc" }, { updatedAt: "desc" }],
  });
  return list.map(toUnified);
}

/** Tổng hợp số lượng bán theo category, sort từ cao xuống thấp.
 *  @param sinceDate  lọc từ ngày này trở đi (mặc định đầu tháng hiện tại)
 */
export async function salesByCategory(sinceDate?: Date): Promise<{ categoryName: string; totalSold: number }[]> {
  const from = sinceDate ?? new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  // Lấy tất cả categories
  const allCats = await prisma.category.findMany({ select: { name: true } });

  // Raw query: join OrderItem → Product → Category, lọc theo tháng
  const rows = await prisma.orderItem.groupBy({
    by: ["productId"],
    where: { order: { orderedAt: { gte: from }, status: { not: "cancelled" } } },
    _sum: { quantity: true },
  });

  // Join với product→category
  const productIds = rows.map((r) => r.productId);
  const products = productIds.length
    ? await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, category: { select: { name: true } } },
      })
    : [];

  const catMap = new Map<string, number>();
  for (const cat of allCats) catMap.set(cat.name, 0);
  for (const row of rows) {
    const prod = products.find((p) => p.id === row.productId);
    if (!prod) continue;
    const cat = prod.category.name;
    catMap.set(cat, (catMap.get(cat) ?? 0) + (row._sum.quantity ?? 0));
  }

  return Array.from(catMap.entries())
    .map(([categoryName, totalSold]) => ({ categoryName, totalSold }))
    .sort((a, b) => b.totalSold - a.totalSold);
}

export async function productsByCategory(categoryName: string, limit = 12): Promise<UnifiedProduct[]> {
  const list = await prisma.product.findMany({
    where: { category: { name: categoryName } },
    take: limit,
    include: { brand: true, category: true, images: { include: { file: true }, orderBy: { sortOrder: "asc" } }, variants: true, marketplaces: true },
    orderBy: [{ isBest: "desc" }, { updatedAt: "desc" }],
  });
  return list.map(toUnified);
}
