import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SessionProviderWrapper from "@/components/admin/SessionProviderWrapper";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = { title: "Admin — Oanh SPA" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <SessionProviderWrapper>
      {session ? (
        <div className="flex min-h-screen bg-zinc-100">
          <AdminSidebar />
          <div className="flex-1 overflow-auto">{children}</div>
        </div>
      ) : (
        // Chưa đăng nhập — chỉ render children (trang login), không sidebar
        <div className="min-h-screen">{children}</div>
      )}
    </SessionProviderWrapper>
  );
}
