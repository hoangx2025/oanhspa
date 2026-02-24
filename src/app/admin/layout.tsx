import SessionProviderWrapper from "@/components/admin/SessionProviderWrapper";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = { title: "Admin — Oanh SPA" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProviderWrapper>
      <div className="flex min-h-screen bg-zinc-100">
        <AdminSidebar />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </SessionProviderWrapper>
  );
}
