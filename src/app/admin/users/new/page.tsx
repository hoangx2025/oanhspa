import UserForm from "@/components/admin/UserForm";

export default function NewUserPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-zinc-800 mb-6">Thêm người dùng mới</h1>
      <UserForm />
    </div>
  );
}
