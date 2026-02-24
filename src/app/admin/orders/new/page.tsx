import { db } from "@/lib/db";
import OrderForm from "@/components/admin/OrderForm";

export default async function NewOrderPage() {
  const products = await db.product.findMany({
    orderBy: { title: "asc" },
    select: { id: true, title: true, variants: { select: { id: true, name: true, value: true, price: true }, orderBy: { sortOrder: "asc" } } },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-zinc-800 mb-6">Thêm đơn hàng mới</h1>
      <OrderForm products={products} />
    </div>
  );
}
