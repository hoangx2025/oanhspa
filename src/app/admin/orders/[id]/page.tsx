import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import OrderForm from "@/components/admin/OrderForm";

export default async function EditOrderPage({ params }: { params: { id: string } }) {
  const [order, products] = await Promise.all([
    db.order.findUnique({
      where: { id: Number(params.id) },
      include: { items: { include: { product: { select: { title: true } } } } },
    }),
    db.product.findMany({
      orderBy: { title: "asc" },
      select: { id: true, title: true, variants: { select: { id: true, name: true, value: true, price: true }, orderBy: { sortOrder: "asc" } } },
    }),
  ]);
  if (!order) notFound();

  const initial = {
    id: order.id,
    platform:   order.platform,
    externalId: order.externalId ?? "",
    orderedAt:  new Date(order.orderedAt).toISOString().slice(0, 16),
    status:     order.status,
    note:       order.note ?? "",
    items: order.items.map(it => ({
      productId:    it.productId as number | "",
      productTitle: it.product.title,
      variantId:    (it.variantId ?? "") as number | "",
      quantity:     it.quantity,
      price:        it.price as number | "",
    })),
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-zinc-800 mb-6">Sửa đơn hàng #{order.id}</h1>
      <OrderForm products={products} initial={initial} />
    </div>
  );
}
