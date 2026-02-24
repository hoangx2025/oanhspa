import Link from "next/link";
import ImageSlider from "@/components/ImageSlider";
import ProductVariants from "@/components/ProductVariants";
import MarketplaceButtons from "@/components/MarketplaceButtons";
import { allProducts, productByHandle } from "@/lib/catalog";
import MarketplaceLinks from "@/components/marketplaceLinks";

export async function generateStaticParams() {
  const items = await allProducts();
  return items.map((p) => ({ handle: p.handle }));
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

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="text-sm opacity-70">
        <Link href="/" className="hover:text-rose-600">
          Trang chủ
        </Link>{" "}
        /{" "}
        <Link href="/collections/all" className="hover:text-rose-600">
          Sản phẩm
        </Link>{" "}
        / <span className="opacity-90">{p.title}</span>
      </div>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        {/* LEFT */}
        <div className="rounded-3xl border bg-white shadow-soft">
          <div className="overflow-hidden rounded-3xl">
            {images.length > 0 ? (
              <ImageSlider images={images} altBase={p.title} youtubeUrl={p.youtubeUrl} fit="cover" />
            ) : (
              <div className="h-[520px] bg-gradient-to-br from-zinc-100 to-white" />
            )}
          </div>

          {/* Mua ngay tại: nằm ngay dưới slider */}
          {p.marketplaces && <MarketplaceLinks links={p.marketplaces} />}
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

          {/* <MarketplaceButtons marketplaces={p.marketplaces || []} /> */}

          {/* Description (chiếm luôn phần "Chính sách" bỏ đi + tối thiểu cao cho cân xứng) */}
          <div className="mt-6 rounded-2xl border bg-white p-5 flex-1 min-h-[260px] md:min-h-[420px]">
            <div className="font-semibold">Mô tả</div>
            <div className="mt-2 whitespace-pre-line text-sm opacity-75">
              {p.description || p.short || "Chưa có mô tả."}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
