"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import type { UnifiedProduct } from "@/data/unifiedProduct";

/** 4 hàng × số cột theo breakpoint */
function usePageSize() {
  const [pageSize, setPageSize] = useState(12);
  useEffect(() => {
    function update() {
      if (window.innerWidth >= 1024) setPageSize(16);
      else if (window.innerWidth >= 640) setPageSize(12);
      else setPageSize(8);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return pageSize;
}

function PageButton({
  label, active, disabled, onClick,
}: {
  label: React.ReactNode; active?: boolean; disabled?: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`min-w-[36px] rounded-lg border px-2.5 py-1.5 text-sm transition
        ${active ? "bg-zinc-900 text-white border-zinc-900" : "bg-white hover:bg-zinc-50"}
        ${disabled ? "opacity-40 cursor-not-allowed" : ""}
      `}
    >
      {label}
    </button>
  );
}

const SCROLL_KEY = "paged_grid_scroll";

export default function PaginatedProductGrid({
  products,
  currentPage,
  baseUrl,
}: {
  products: UnifiedProduct[];
  currentPage: number;
  baseUrl: string;
}) {
  const router = useRouter();
  const pageSize = usePageSize();
  const totalPages = Math.ceil(products.length / pageSize);
  const page = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));
  const sliced = products.slice((page - 1) * pageSize, page * pageSize);

  // Khi mount: khôi phục scroll nếu vừa quay lại từ trang chi tiết
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    try {
      const raw = sessionStorage.getItem(SCROLL_KEY);
      if (raw) {
        const { href, y } = JSON.parse(raw) as { href: string; y: number };
        if (href === window.location.href) {
          // setTimeout để chờ DOM render xong mới scroll
          setTimeout(() => window.scrollTo({ top: y, behavior: "instant" }), 120);
          sessionStorage.removeItem(SCROLL_KEY);
        }
      }
    } catch {}
  }, []);

  // Lưu scroll ngay khi user click vào link sản phẩm — TRƯỚC khi navigation xảy ra
  function handleGridClick(e: React.MouseEvent<HTMLDivElement>) {
    const anchor = (e.target as HTMLElement).closest("a");
    if (!anchor) return;
    try {
      sessionStorage.setItem(
        SCROLL_KEY,
        JSON.stringify({ href: window.location.href, y: window.scrollY })
      );
    } catch {}
  }

  function goTo(p: number) {
    const sep = baseUrl.includes("?") ? "&" : "?";
    router.push(`${baseUrl}${sep}page=${p}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function pageRange(): (number | "...")[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const range: (number | "...")[] = [1];
    if (page > 3) range.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      range.push(i);
    }
    if (page < totalPages - 2) range.push("...");
    range.push(totalPages);
    return range;
  }

  if (products.length === 0) {
    return <div className="mt-10 text-center text-sm opacity-60">Không có sản phẩm nào.</div>;
  }

  return (
    <>
      {/* onClick ở đây bắt sự kiện bubble từ tất cả <a> trong grid */}
      <div onClick={handleGridClick}>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {sliced.map((p) => (
            <ProductCard key={p.handle} p={p} />
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <PageButton label="← Trước" disabled={page <= 1} onClick={() => goTo(page - 1)} />

            {pageRange().map((item, idx) =>
              item === "..." ? (
                <span key={`e-${idx}`} className="px-1 text-sm opacity-50">…</span>
              ) : (
                <PageButton
                  key={item}
                  label={item}
                  active={item === page}
                  onClick={() => goTo(item as number)}
                />
              )
            )}

            <PageButton label="Tiếp →" disabled={page >= totalPages} onClick={() => goTo(page + 1)} />
          </div>

          <div className="text-xs opacity-50">
            Trang {page} / {totalPages} &nbsp;·&nbsp; {products.length} sản phẩm
          </div>
        </div>
      )}
    </>
  );
}
