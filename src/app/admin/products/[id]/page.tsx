import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, brands, categories] = await Promise.all([
    db.product.findUnique({
      where: { id: Number(params.id) },
      include: {
        variants: { orderBy: { sortOrder: "asc" } },
        images: { include: { file: true }, orderBy: { sortOrder: "asc" } },
        marketplaces: { orderBy: { sortOrder: "asc" } },
      },
    }),
    db.brand.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    db.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  if (!product) notFound();

  const initial = {
    id: product.id,
    handle: product.handle,
    title: product.title,
    short: product.short ?? "",
    description: product.description ?? "",
    imageHint: product.imageHint ?? "",
    isHot: product.isHot,
    isBest: product.isBest,
    flashSaleEndsAt: product.flashSaleEndsAt
      ? new Date(product.flashSaleEndsAt).toISOString().slice(0, 16)
      : "",
    youtubeUrl: product.youtubeUrl ?? "",
    brandId: product.brandId,
    categoryId: product.categoryId,
    variants: product.variants.map((v) => ({
      name: v.name,
      value: v.value,
      price: v.price as number | "",
      compareAt: (v.compareAt ?? "") as number | "",
      stock: v.stock as number | "",
      sku: v.sku ?? "",
    })),
    images: product.images.map((img, i) => ({
      fileId: img.fileId,
      url: img.file.url,
      alt: img.alt ?? "",
      sortOrder: i,
    })),
    marketplaces: product.marketplaces.map((m) => ({
      platform: m.platform,
      productUrl: m.productUrl,
    })),
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-zinc-800 mb-6">Sửa sản phẩm</h1>
      <ProductForm brands={brands} categories={categories} initial={initial} />
    </div>
  );
}
