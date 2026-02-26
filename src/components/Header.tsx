"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import NavigationProgress from "@/components/NavigationProgress";

interface Category {
  name: string;
  slug: string;
}

export default function Header() {
  const pathname = usePathname();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<{ handle: string; title: string }[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d))
      .catch(() => {});
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setCatOpen(false);
  }, [pathname]);

  // Search
  useEffect(() => {
    const query = q.trim();
    if (!query) {
      setResults([]);
      return;
    }
    const t = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then((r) => r.json())
        .then((d) => setResults(d.products || []))
        .catch(() => setResults([]));
    }, 180);
    return () => clearTimeout(t);
  }, [q]);

  const closeMobile = () => {
    setMobileMenuOpen(false);
    setCatOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
      {/* Top banner */}
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

      <NavigationProgress />

      {/* Main header */}
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center gap-4">
        {/* Hamburger button - mobile only */}
        <button
          className="md:hidden p-1 -ml-1"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label="Menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <Link href="/" className="font-semibold tracking-wide text-lg">
          OANH SPA<span className="text-rose-500">.</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm ml-6">
          <Link className="hover:text-rose-600" href="/collections/all">Tất cả sản phẩm</Link>

          {/* Danh mục dropdown */}
          <div className="relative group">
            <button className="hover:text-rose-600 flex items-center gap-1">
              Danh mục
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-150 absolute top-full left-0 pt-2 min-w-[200px]">
              <div className="rounded-xl border bg-white shadow-lg py-2">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/collections/all?category=${c.slug}`}
                    className="block px-4 py-2 text-sm hover:bg-zinc-50 hover:text-rose-600"
                  >
                    {c.name}
                  </Link>
                ))}
                {categories.length === 0 && (
                  <div className="px-4 py-2 text-sm text-zinc-400">Đang tải...</div>
                )}
              </div>
            </div>
          </div>

          <Link className="hover:text-rose-600" href="/collections/san-pham-ban-chay">Bán chạy</Link>
          <Link className="hover:text-rose-600" href="/collections/flash-sale">Flash Sale</Link>
        </nav>

        {/* Search */}
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
            <div className="absolute mt-2 w-full rounded-2xl border bg-white shadow-soft overflow-hidden z-50">
              {results.map((p) => (
                <Link
                  key={p.handle}
                  href={`/products/${p.handle}`}
                  className="block px-4 py-3 text-sm hover:bg-zinc-50"
                >
                  {p.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <nav className="mx-auto max-w-6xl px-4 py-3 flex flex-col text-sm">
            <Link className="py-2.5 hover:text-rose-600" href="/collections/all" onClick={closeMobile}>
              Tất cả sản phẩm
            </Link>

            {/* Danh mục accordion */}
            <button
              className="py-2.5 flex items-center justify-between hover:text-rose-600 text-left"
              onClick={() => setCatOpen((v) => !v)}
            >
              Danh mục
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 transition-transform ${catOpen ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {catOpen && (
              <div className="pl-4 flex flex-col border-l border-zinc-200 ml-2 mb-1">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/collections/all?category=${c.slug}`}
                    className="py-2 text-zinc-600 hover:text-rose-600"
                    onClick={closeMobile}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}

            <Link className="py-2.5 hover:text-rose-600" href="/collections/san-pham-ban-chay" onClick={closeMobile}>
              Bán chạy
            </Link>
            <Link className="py-2.5 hover:text-rose-600" href="/collections/flash-sale" onClick={closeMobile}>
              Flash Sale
            </Link>

            {/* Links from top banner (visible on mobile here) */}
            <div className="border-t mt-2 pt-2 flex flex-col text-zinc-500">
              <Link className="py-2 hover:text-rose-600" href="/pages/about-us" onClick={closeMobile}>
                Giới thiệu
              </Link>
              <Link className="py-2 hover:text-rose-600" href="/blogs" onClick={closeMobile}>
                Tin tức
              </Link>
              <Link className="py-2 hover:text-rose-600" href="/contact" onClick={closeMobile}>
                Liên hệ
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
