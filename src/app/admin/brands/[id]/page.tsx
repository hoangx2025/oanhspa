import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import BrandForm from "@/components/admin/BrandForm";

export default async function EditBrandPage({ params }: { params: { id: string } }) {
  const brand = await db.brand.findUnique({ where: { id: Number(params.id) } });
  if (!brand) notFound();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-zinc-800 mb-6">Sửa thương hiệu</h1>
      <BrandForm initial={{ ...brand, heroNote: brand.heroNote ?? "", heroImage: brand.heroImage ?? "", tagline: brand.tagline ?? "" }} />
    </div>
  );
}
