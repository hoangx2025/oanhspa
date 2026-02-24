import Link from "next/link";
import { db } from "@/lib/db";
import DeleteButton from "../products/DeleteButton";

export default async function AdminUsersPage() {
  const users = await db.aspNetUsers.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, email: true, userName: true, emailConfirmed: true,
      createdAt: true, lockoutEnabled: true,
      userRoles: { include: { role: { select: { name: true } } } },
    },
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-zinc-800">Người dùng</h1>
        <Link href="/admin/users/new" className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700">
          + Thêm mới
        </Link>
      </div>
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-zinc-600">Email</th>
              <th className="text-left px-4 py-3 font-medium text-zinc-600">Roles</th>
              <th className="text-left px-4 py-3 font-medium text-zinc-600">Xác thực</th>
              <th className="text-left px-4 py-3 font-medium text-zinc-600">Ngày tạo</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-zinc-50">
                <td className="px-4 py-3">
                  <div className="font-medium">{u.email}</div>
                  <div className="text-xs text-zinc-400">{u.userName}</div>
                </td>
                <td className="px-4 py-3">
                  {u.userRoles.map((ur) => (
                    <span key={ur.role.name} className="inline-block rounded-full bg-rose-100 text-rose-700 text-xs px-2 py-0.5 mr-1">
                      {ur.role.name}
                    </span>
                  ))}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs ${u.emailConfirmed ? "text-green-600" : "text-zinc-400"}`}>
                    {u.emailConfirmed ? "Đã xác thực" : "Chưa xác thực"}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-400 text-xs">
                  {new Date(u.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <Link href={`/admin/users/${u.id}`} className="text-xs text-rose-600 hover:underline">Sửa</Link>
                    <DeleteButton id={u.id} type="users" label={u.email ?? u.id} />
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-zinc-400">Chưa có người dùng.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
