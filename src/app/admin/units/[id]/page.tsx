import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import UnitForm from "@/components/admin/UnitForm";

export default async function EditUnitPage({ params }: { params: { id: string } }) {
  const unit = await db.unit.findUnique({ where: { id: Number(params.id) } });
  if (!unit) notFound();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-zinc-800 mb-6">Sửa đơn vị</h1>
      <UnitForm initial={{ id: unit.id, name: unit.name }} />
    </div>
  );
}
