import Link from "next/link";
import { db } from "@/lib/db";

export default async function AdminDashboard() {
  const [products, brands, categories, users] = await Promise.all([
    db.product.count(),
    db.brand.count(),
    db.category.count(),
    db.aspNetUsers.count(),
  ]);

  const recentProducts = await db.product.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, handle: true, title: true, createdAt: true },
  });

  const stats = [
    { label: "Sản phẩm", value: products, href: "/admin/products" },
    { label: "Thương hiệu", value: brands, href: "/admin/brands" },
    { label: "Danh mục", value: categories, href: "/admin/categories" },
    { label: "Người dùng", value: users, href: "/admin/users" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-zinc-800">Dashboard</h1>
      <p className="mt-1 text-sm text-zinc-500">Tổng quan hệ thống Oanh SPA Admin</p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="rounded-2xl bg-white border p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl font-bold text-zinc-800">{s.value}</div>
            <div className="mt-1 text-sm text-zinc-500">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-2xl border shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="font-semibold text-zinc-800">Sản phẩm mới nhất</h2>
          <Link href="/admin/products/new" className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-700">
            + Thêm mới
          </Link>
        </div>
        <div className="divide-y">
          {recentProducts.map((p) => (
            <div key={p.id} className="flex items-center justify-between px-5 py-3">
              <div>
                <div className="text-sm font-medium text-zinc-800">{p.title}</div>
                <div className="text-xs text-zinc-400">{p.handle}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-400">
                  {new Date(p.createdAt).toLocaleDateString("vi-VN")}
                </span>
                <Link href={`/admin/products/${p.id}`} className="text-xs text-rose-600 hover:underline">
                  Sửa
                </Link>
              </div>
            </div>
          ))}
          {recentProducts.length === 0 && (
            <div className="px-5 py-6 text-sm text-zinc-400 text-center">Chưa có sản phẩm nào.</div>
          )}
        </div>
      </div>
    </div>
  );
}
