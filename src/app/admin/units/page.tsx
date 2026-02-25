import Link from "next/link";
import { db } from "@/lib/db";
import DeleteButton from "../products/DeleteButton";

export default async function AdminUnitsPage() {
  const units = await db.unit.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-zinc-800">Đơn vị biến thể</h1>
        <Link href="/admin/units/new" className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700">
          + Thêm mới
        </Link>
      </div>
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-zinc-600">Tên đơn vị</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {units.map((u) => (
              <tr key={u.id} className="hover:bg-zinc-50">
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <Link href={`/admin/units/${u.id}`} className="text-xs text-rose-600 hover:underline">Sửa</Link>
                    <DeleteButton id={u.id} type="units" label={u.name} />
                  </div>
                </td>
              </tr>
            ))}
            {units.length === 0 && (
              <tr><td colSpan={2} className="px-4 py-8 text-center text-zinc-400">Chưa có đơn vị nào.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
