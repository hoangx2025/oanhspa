"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";

type Category = { name: string; slug: string };

export default function CategoryFilter({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const active = searchParams.get("category") ?? "";

  function buildUrl(categorySlug: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page"); // reset page khi đổi filter
    if (categorySlug) {
      params.set("category", categorySlug);
    } else {
      params.delete("category");
    }
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  function go(categorySlug: string) {
    router.push(buildUrl(categorySlug), { scroll: false });
  }

  if (categories.length === 0) return null;

  return (
    <div className="mt-5 flex flex-wrap gap-2">
      <button
        onClick={() => go("")}
        className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
          !active
            ? "bg-zinc-900 text-white border-zinc-900"
            : "bg-white text-zinc-600 hover:bg-zinc-50"
        }`}
      >
        Tất cả
      </button>
      {categories.map((c) => (
        <button
          key={c.slug}
          onClick={() => go(c.slug)}
          className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
            active === c.slug
              ? "bg-rose-600 text-white border-rose-600"
              : "bg-white text-zinc-600 hover:bg-zinc-50"
          }`}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}
