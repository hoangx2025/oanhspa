"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { UnifiedProduct } from "@/data/unifiedProduct";
import ProductCard from "@/components/ProductCard";

type Brand = { name: string; slug: string; tagline?: string | null; heroNote?: string | null };

export default function BrandShowcaseClient({ brands }: { brands: Brand[] }) {
  const first = brands[0]?.slug;
  const [active, setActive] = useState<string>(first || "");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<UnifiedProduct[]>([]);

  const activeBrand = useMemo(() => brands.find((b) => b.slug === active), [brands, active]);

  useEffect(() => {
    if (!active) return;
    let cancel = false;
    setLoading(true);
    fetch(`/api/brands/${encodeURIComponent(active)}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancel) return;
        setItems(d.products || []);
      })
      .finally(() => {
        if (!cancel) setLoading(false);
      });
    return () => {
      cancel = true;
    };
  }, [active]);

  return (
    <>
      <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs opacity-90">
        {brands.map((b) => (
          <button
            key={b.slug}
            onClick={() => setActive(b.slug)}
            className={`rounded-2xl border px-3 py-4 transition ${
              b.slug === active
                ? "bg-zinc-900 text-white border-zinc-900"
                : "bg-zinc-50 hover:bg-white"
            }`}
            type="button"
          >
            {b.name}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border bg-gradient-to-br from-rose-50 to-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-rose-600">{activeBrand?.tagline || "Luxury"}</div>
            <div className="mt-1 text-lg font-semibold">{activeBrand?.name || ""}</div>
            <div className="mt-2 text-sm opacity-70">{activeBrand?.heroNote || ""}</div>
          </div>
          <Link
            href="/collections/all"
            className="rounded-xl border bg-white px-4 py-2 text-sm hover:bg-zinc-50"
          >
            Xem tất cả
          </Link>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {loading ? (
            [0, 1].map((i) => (
              <div key={i} className="h-44 rounded-2xl border bg-white/70" />
            ))
          ) : items.length > 0 ? (
            items.slice(0, 2).map((p) => <ProductCard key={p.handle} p={p} />)
          ) : (
            <div className="rounded-2xl border bg-white p-4 text-sm opacity-70 sm:col-span-2">
              Chưa có sản phẩm cho thương hiệu này.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
