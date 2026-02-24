import Link from "next/link";
import { productByHandle, allProducts } from "@/lib/catalog";
import { discountPercent, formatVND } from "@/lib/money";
import ImageSlider from "@/components/ImageSlider";
import ProductVariants from "@/components/ProductVariants";

export function generateStaticParams() {
  return allProducts().map((p) => ({ handle: p.handle }));
}

export default function ProductPage({
  params,
}: {
  params: { handle: string };
}) {
  const p = productByHandle(params.handle);
  if (!p) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-2xl border p-6">Không tìm thấy sản phẩm.</div>
      </main>
    );
  }

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
        <div className="rounded-3xl border bg-gradient-to-br from-zinc-100 to-white shadow-soft">
          {(() => {
            const images = (p.images || []).filter(
              (x) => (x || "").trim().length > 0,
            );

            if (images.length === 0) {
              return (
                <>
                  <div className="mt-6 h-80 rounded-2xl bg-gradient-to-br from-rose-200 to-white" />
                  <div className="mt-4 grid grid-cols-4 gap-3">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-16 rounded-xl bg-white border"
                      />
                    ))}
                  </div>
                </>
              );
            }

            return (
              <div>
                <ImageSlider
                  images={images}
                  altBase={p.title}
                  youtubeUrl={p.youtubeUrl}
                />
              </div>
            );
          })()}
        </div>

        <div>
          <h1 className="text-3xl font-semibold leading-tight">{p.title}</h1>

          {p.variants && p.variants.length > 0 ? (
            <ProductVariants variants={p.variants} />
          ) : (
            <div className="mt-6 rounded-2xl border bg-white p-5">
              <div className="text-sm font-semibold">Tùy chọn</div>
              <div className="mt-3 text-sm opacity-70">
                Sản phẩm hiện chưa có tùy chọn.
              </div>
            </div>
          )}

          {p.description && (
            <div className="mt-6 rounded-2xl border bg-white p-6 text-sm leading-7">
              <div className="font-semibold mb-2">Mô tả</div>
              <div className="opacity-80">{p.description}</div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
