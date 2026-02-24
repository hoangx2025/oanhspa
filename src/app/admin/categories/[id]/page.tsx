import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import CategoryForm from "@/components/admin/CategoryForm";

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const category = await db.category.findUnique({ where: { id: Number(params.id) } });
  if (!category) notFound();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-zinc-800 mb-6">Sửa danh mục</h1>
      <CategoryForm initial={category} />
    </div>
  );
}
