import { db } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const [brands, categories, units] = await Promise.all([
    db.brand.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    db.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    db.unit.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-zinc-800 mb-6">Thêm sản phẩm mới</h1>
      <ProductForm brands={brands} categories={categories} units={units} />
    </div>
  );
}
