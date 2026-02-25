"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Đơn hàng" },
  { href: "/admin/products", label: "Sản phẩm" },
  { href: "/admin/brands", label: "Thương hiệu" },
  { href: "/admin/categories", label: "Danh mục" },
  { href: "/admin/units", label: "Đơn vị" },
  { href: "/admin/users", label: "Người dùng" },
  { href: "/admin/settings/s3", label: "Cấu hình S3" },
  { href: "/admin/settings/mfa", label: "Bảo mật (MFA)" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 bg-zinc-900 min-h-screen flex flex-col">
      <div className="px-5 py-5 border-b border-zinc-700">
        <span className="text-white font-bold text-lg">Oanh SPA</span>
        <span className="ml-2 text-xs text-zinc-400">Admin</span>
      </div>
      <nav className="flex-1 py-4 flex flex-col gap-1 px-3">
        {NAV.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-rose-600 text-white font-medium"
                  : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 pb-5">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white text-left transition-colors"
        >
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
