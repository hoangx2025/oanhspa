"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Brand = { name: string; slug: string; tagline?: string | null; heroNote?: string | null; heroImage?: string | null };

export default function BrandShowcaseClient({ brands }: { brands: Brand[] }) {
  const [active, setActive] = useState<string>(brands[0]?.slug || "");

  const activeBrand = useMemo(() => brands.find((b) => b.slug === active), [brands, active]);

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
            <div className="text-xs uppercase tracking-widest text-rose-600">
              {activeBrand?.tagline || "Luxury"}
            </div>
            <div className="mt-1 text-lg font-semibold">{activeBrand?.name || ""}</div>
            <div className="mt-2 text-sm opacity-70">{activeBrand?.heroNote || ""}</div>
          </div>
          <Link
            href="/collections/all"
            className="shrink-0 rounded-xl border bg-white px-4 py-2 text-sm hover:bg-zinc-50"
          >
            Xem tất cả
          </Link>
        </div>

        {/* Ảnh brand — chiều cao cố định, không thay đổi layout */}
        <div className="mt-5 h-48 overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-100 to-white flex items-center justify-center">
          {activeBrand?.heroImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={activeBrand.heroImage}
              alt={activeBrand.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-2xl font-semibold opacity-20">{activeBrand?.name}</span>
          )}
        </div>
      </div>
    </>
  );
}
