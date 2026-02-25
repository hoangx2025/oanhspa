import Link from "next/link";
import { db } from "@/lib/db";
import DeleteButton from "./DeleteButton";

function resolveImageUrl(file: { url: string; presignedUrl: string | null; presignedExpiry: Date | null } | null): string | null {
  if (!file) return null;
  if (file.presignedUrl && file.presignedExpiry && file.presignedExpiry > new Date()) {
    return file.presignedUrl;
  }
  return file.url;
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams?: { q?: string; page?: string };
}) {
  const q = searchParams?.q ?? "";
  const page = Math.max(1, Number(searchParams?.page ?? "1"));
  const limit = 20;
  const where = q ? { title: { contains: q } } : {};
  const [total, products] = await Promise.all([
    db.product.count({ where }),
    db.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        brand: { select: { name: true } },
        category: { select: { name: true } },
        _count: { select: { variants: true } },
        images: {
          take: 1,
          orderBy: { sortOrder: "asc" },
          include: { file: { select: { url: true, presignedUrl: true, presignedExpiry: true } } },
        },
      },
    }),
  ]);
  const pages = Math.ceil(total / limit);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-zinc-800">Sản phẩm</h1>
        <Link href="/admin/products/new" className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700">
          + Thêm mới
        </Link>
      </div>

      <form method="get" className="mb-4 flex gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Tìm kiếm sản phẩm..."
          className="rounded-lg border px-3 py-2 text-sm flex-1 max-w-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
        />
        <button type="submit" className="rounded-lg border px-4 py-2 text-sm hover:bg-zinc-50">Tìm</button>
      </form>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b">
            <tr>
              <th className="w-16 px-4 py-3"></th>
              <th className="text-left px-4 py-3 font-medium text-zinc-600">Tên sản phẩm</th>
              <th className="text-left px-4 py-3 font-medium text-zinc-600">Thương hiệu</th>
              <th className="text-left px-4 py-3 font-medium text-zinc-600">Danh mục</th>
              <th className="text-left px-4 py-3 font-medium text-zinc-600">Biến thể</th>
              <th className="text-left px-4 py-3 font-medium text-zinc-600">Ngày tạo</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((p) => {
              const thumbUrl = resolveImageUrl(p.images[0]?.file ?? null);
              return (
                <tr key={p.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-2">
                    {thumbUrl ? (
                      <img
                        src={thumbUrl}
                        alt={p.title}
                        className="w-12 h-12 object-cover rounded-lg border bg-zinc-100"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg border bg-zinc-100" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{p.title}</div>
                    <div className="text-xs text-zinc-400">{p.handle}</div>
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{p.brand.name}</td>
                  <td className="px-4 py-3 text-zinc-600">{p.category.name}</td>
                  <td className="px-4 py-3 text-zinc-600">{p._count.variants}</td>
                  <td className="px-4 py-3 text-zinc-400 text-xs">
                    {new Date(p.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Link href={`/admin/products/${p.id}`} className="text-xs text-rose-600 hover:underline">Sửa</Link>
                      <DeleteButton id={p.id} type="products" label={p.title} />
                    </div>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-zinc-400">Không có sản phẩm nào.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="mt-4 flex gap-2">
          {Array.from({ length: pages }, (_, i) => i + 1).map((pg) => (
            <Link
              key={pg}
              href={`/admin/products?q=${q}&page=${pg}`}
              className={`rounded-lg px-3 py-1.5 text-sm border ${pg === page ? "bg-rose-600 text-white border-rose-600" : "hover:bg-zinc-50"}`}
            >
              {pg}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
