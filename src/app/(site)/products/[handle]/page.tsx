import type { Metadata } from "next";
import Link from "next/link";
import ImageSlider from "@/components/ImageSlider";
import ProductVariants from "@/components/ProductVariants";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { allProducts, productByHandle } from "@/lib/catalog";
import { seoConfig, productUrl } from "@/lib/seo";
import MarketplaceLinks from "@/components/marketplaceLinks";

export async function generateStaticParams() {
  try {
    const items = await allProducts();
    return items.map((p) => ({ handle: p.handle }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const p = await productByHandle(params.handle);
  if (!p) return { title: "Sản phẩm không tồn tại" };

  const title = p.title;
  const description = p.short || p.description || `${p.title} - ${p.brand} chính hãng tại OANH SPA`;
  const url = productUrl(p.handle);
  const images = (p.images || []).filter((x) => x.trim().length > 0);

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${seoConfig.siteName}`,
      description,
      url,
      type: "website",
      images: images.length > 0
        ? images.slice(0, 4).map((img) => ({ url: img }))
        : [{ url: seoConfig.defaultOgImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${seoConfig.siteName}`,
      description,
      images: images.length > 0 ? [images[0]] : [seoConfig.defaultOgImage],
    },
    alternates: { canonical: `/products/${p.handle}` },
  };
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const p = await productByHandle(params.handle);

  if (!p) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-2xl border p-6">Không tìm thấy sản phẩm.</div>
      </main>
    );
  }

  const images = (p.images || []).filter((x) => (x || "").trim().length > 0);
  const url = productUrl(p.handle);

  return (
    <article className="mx-auto max-w-6xl px-4 py-10">
      <ProductJsonLd
        name={p.title}
        description={p.short || p.description}
        images={images}
        brand={p.brand}
        url={url}
        variants={(p.variants || []).map((v) => ({ price: v.price, compareAtPrice: v.compareAtPrice }))}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Trang chủ", url: seoConfig.siteUrl },
          { name: "Sản phẩm", url: `${seoConfig.siteUrl}/collections/all` },
          { name: p.title },
        ]}
      />

      <nav aria-label="breadcrumb">
        <ol className="flex items-center gap-1.5 text-sm opacity-70">
          <li>
            <Link href="/" className="hover:text-rose-600">Trang chủ</Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/collections/all" className="hover:text-rose-600">Sản phẩm</Link>
          </li>
          <li>/</li>
          <li><span className="opacity-90">{p.title}</span></li>
        </ol>
      </nav>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        {/* LEFT */}
        <div className="flex flex-col rounded-xl border bg-white shadow-soft">
          <div className="overflow-hidden rounded-xl">
            {images.length > 0 ? (
              <ImageSlider images={images} altBase={p.title} youtubeUrl={p.youtubeUrl} fit="cover" />
            ) : (
              <div className="h-[520px] bg-gradient-to-br from-zinc-100 to-white" />
            )}
          </div>

          {/* Mua ngay tại: nằm ngay dưới slider */}
          <MarketplaceLinks links={p.marketplaces || []} productTitle={p.title} />
        </div>

        {/* RIGHT */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-semibold leading-tight">{p.title}</h1>

          {p.variants && p.variants.length > 0 ? (
            <ProductVariants variants={p.variants} />
          ) : (
            <div className="mt-6 rounded-2xl border bg-white p-5">
              <div className="text-sm font-semibold">Tùy chọn</div>
              <div className="mt-3 text-sm opacity-70">Sản phẩm hiện chưa có tùy chọn.</div>
            </div>
          )}

          {/* Description */}
          <div className="mt-6 rounded-2xl border bg-white p-5 flex-1 min-h-[260px] md:min-h-[420px]">
            <div className="font-semibold">Mô tả</div>
            <div className="mt-2 whitespace-pre-line text-sm opacity-75">
              {p.description || p.short || "Chưa có mô tả."}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
