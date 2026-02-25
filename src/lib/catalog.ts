import { prisma } from "@/lib/db";
import type { UnifiedProduct, ProductVariant } from "@/data/unifiedProduct";

function resolveImageUrl(file: any): string | null {
  if (!file) return null;
  // Dùng presigned URL nếu còn hạn
  if (file.presignedUrl && file.presignedExpiry && new Date(file.presignedExpiry) > new Date()) {
    return file.presignedUrl;
  }
  return file.url ?? null;
}

function toUnified(p: any): UnifiedProduct {
  const images: string[] = (p.images || [])
    .slice()
    .sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((x: any) => resolveImageUrl(x?.file))
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

export async function categories(): Promise<{ name: string; slug: string }[]> {
  const list = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return list.map((c) => ({ name: c.name, slug: c.slug }));
}

const PRODUCT_INCLUDE = {
  brand: true,
  category: true,
  images: { include: { file: true }, orderBy: { sortOrder: "asc" } as const },
  variants: { orderBy: { sortOrder: "asc" } as const },
  marketplaces: { orderBy: { sortOrder: "asc" } as const },
} as const;

/** Lấy sản phẩm với bộ lọc tuỳ chọn: brand slug, category slug */
export async function productsByFilters(opts: {
  brandSlug?: string;
  categorySlug?: string;
  isBest?: boolean;
  isHot?: boolean;
  hasFlashSale?: boolean;
  limit?: number;
}): Promise<UnifiedProduct[]> {
  const { brandSlug, categorySlug, isBest, isHot, hasFlashSale, limit = 200 } = opts;

  const where: Record<string, unknown> = {};
  if (brandSlug) where.brand = { slug: brandSlug };
  if (categorySlug) where.category = { slug: categorySlug };
  if (isBest) where.isBest = true;
  if (isHot) where.isHot = true;
  if (hasFlashSale) where.flashSaleEndsAt = { not: null };

  const list = await prisma.product.findMany({
    where,
    take: limit,
    include: PRODUCT_INCLUDE,
    orderBy: [{ isBest: "desc" }, { updatedAt: "desc" }],
  });
  return list.map(toUnified);
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
