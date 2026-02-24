"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { allProducts } from "@/lib/catalog";

export default function Header() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return allProducts()
      .filter(p => p.title.toLowerCase().includes(s))
      .slice(0, 6);
  }, [q]);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
      <div className="bg-zinc-900 text-white text-xs">
        <div className="mx-auto max-w-6xl px-4 py-2 flex items-center justify-between">
          <div>Hotline: 1900 0000 • Miễn phí vận chuyển từ 500.000đ</div>
          <div className="hidden sm:flex gap-4 opacity-90">
            <Link href="/pages/about-us" className="hover:opacity-100">Giới thiệu</Link>
            <Link href="/blogs" className="hover:opacity-100">Tin tức</Link>
            <Link href="/contact" className="hover:opacity-100">Liên hệ</Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center gap-4">
        <Link href="/" className="font-semibold tracking-wide text-lg">
          OANH SPA<span className="text-rose-500">.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm ml-6">
          <Link className="hover:text-rose-600" href="/collections/all">Tất cả sản phẩm</Link>
          <Link className="hover:text-rose-600" href="/collections/my-pham">Mỹ phẩm</Link>
          <Link className="hover:text-rose-600" href="/collections/san-pham-ban-chay">Bán chạy</Link>
          <Link className="hover:text-rose-600" href="/collections/flash-sale">Flash Sale</Link>
        </nav>

        <div className="ml-auto relative w-full max-w-md">
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 120)}
            placeholder="Tìm kiếm sản phẩm…"
            className="w-full rounded-2xl border px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-rose-200"
          />

          {open && results.length > 0 && (
            <div className="absolute mt-2 w-full rounded-2xl border bg-white shadow-soft overflow-hidden">
              {results.map(p => (
                <Link
                  key={p.id}
                  href={`/products/${p.handle}`}
                  className="block px-4 py-3 text-sm hover:bg-zinc-50"
                >
                  {p.title}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* <div className="hidden sm:flex gap-3 text-sm">
          <Link href="#" className="rounded-xl border px-3 py-2 hover:bg-zinc-50"></Link>
          <Link href="/account" className="rounded-xl border px-3 py-2 hover:bg-zinc-50">Tài khoản</Link>
        </div> */}
      </div>
    </header>
  );
}
