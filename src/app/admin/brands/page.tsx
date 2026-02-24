import Link from "next/link";
import { db } from "@/lib/db";
import DeleteButton from "../products/DeleteButton";

export default async function AdminBrandsPage() {
  const brands = await db.brand.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-zinc-800">Thương hiệu</h1>
        <Link href="/admin/brands/new" className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700">
          + Thêm mới
        </Link>
      </div>
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-zinc-600">Tên</th>
              <th className="text-left px-4 py-3 font-medium text-zinc-600">Slug</th>
              <th className="text-left px-4 py-3 font-medium text-zinc-600">Sản phẩm</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {brands.map((b) => (
              <tr key={b.id} className="hover:bg-zinc-50">
                <td className="px-4 py-3 font-medium">{b.name}</td>
                <td className="px-4 py-3 text-zinc-500">{b.slug}</td>
                <td className="px-4 py-3 text-zinc-500">{b._count.products}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <Link href={`/admin/brands/${b.id}`} className="text-xs text-rose-600 hover:underline">Sửa</Link>
                    <DeleteButton id={b.id} type="brands" label={b.name} />
                  </div>
                </td>
              </tr>
            ))}
            {brands.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-zinc-400">Chưa có thương hiệu.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
