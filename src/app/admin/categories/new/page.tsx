import CategoryForm from "@/components/admin/CategoryForm";

export default function NewCategoryPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-zinc-800 mb-6">Thêm danh mục mới</h1>
      <CategoryForm />
    </div>
  );
}
