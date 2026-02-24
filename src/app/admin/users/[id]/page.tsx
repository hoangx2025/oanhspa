import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import UserForm from "@/components/admin/UserForm";

export default async function EditUserPage({ params }: { params: { id: string } }) {
  const user = await db.aspNetUsers.findUnique({
    where: { id: params.id },
    include: { userRoles: { include: { role: true } } },
  });
  if (!user) notFound();

  const role = user.userRoles[0]?.role.name ?? "";

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-zinc-800 mb-6">Sửa người dùng</h1>
      <UserForm initial={{ id: user.id, email: user.email ?? "", role }} isEdit />
    </div>
  );
}
