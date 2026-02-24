import Link from "next/link";
import { db } from "@/lib/db";
import DeleteButton from "../products/DeleteButton";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams?: { platform?: string; page?: string };
}) {
  const platform = searchParams?.platform ?? "";
  const page  = Math.max(1, Number(searchParams?.page ?? "1"));
  const limit = 20;
  const where = platform ? { platform } : {};

  const [total, orders] = await Promise.all([
    db.order.count({ where }),
    db.order.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { orderedAt: "desc" },
      include: {
        items: {
          include: {
            product: { select: { title: true, category: { select: { name: true } } } },
          },
        },
      },
    }),
  ]);
  const pages = Math.ceil(total / limit);

  // Thống kê theo category tháng hiện tại
  const now   = new Date();
  const from  = new Date(now.getFullYear(), now.getMonth(), 1);
  const stats = await db.orderItem.groupBy({
    by: ["productId"],
    where: { order: { orderedAt: { gte: from }, status: { not: "cancelled" } } },
    _sum: { quantity: true },
  });
  const productIds = stats.map(s => s.productId);
  const prodCats = productIds.length
    ? await db.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, category: { select: { name: true } } },
      })
    : [];
  const catSales = new Map<string, number>();
  for (const s of stats) {
    const cat = prodCats.find(p => p.id === s.productId)?.category.name ?? "Khác";
    catSales.set(cat, (catSales.get(cat) ?? 0) + (s._sum.quantity ?? 0));
  }
  const catRanking = Array.from(catSales.entries()).sort((a, b) => b[1] - a[1]);

  const PLATFORM_LABELS: Record<string, string> = { shopee: "Shopee", lazada: "Lazada", tiki: "Tiki", sendo: "Sendo", website: "Website", other: "Khác" };
  const STATUS_COLORS: Record<string, string> = {
    completed: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    cancelled: "bg-red-100 text-red-600",
    returned: "bg-zinc-100 text-zinc-600",
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-zinc-800">Đơn hàng</h1>
        <Link href="/admin/orders/new" className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700">
          + Thêm đơn
        </Link>
      </div>

      {/* Category ranking this month */}
      {catRanking.length > 0 && (
        <div className="mb-6 bg-white rounded-2xl border shadow-sm p-4">
          <div className="text-xs font-medium text-zinc-500 mb-3 uppercase tracking-widest">Bán chạy tháng này theo danh mục</div>
          <div className="flex flex-wrap gap-3">
            {catRanking.map(([cat, qty], idx) => (
              <div key={cat} className="flex items-center gap-2 rounded-xl bg-zinc-50 border px-4 py-2">
                <span className="text-xs font-bold text-rose-600">#{idx + 1}</span>
                <span className="text-sm font-medium">{cat}</span>
                <span className="text-sm font-bold text-zinc-800">{qty.toLocaleString("vi-VN")}</span>
                <span className="text-xs text-zinc-400">đơn vị</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter */}
      <form method="get" className="mb-4 flex gap-2 flex-wrap">
        <select name="platform" defaultValue={platform} className="rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400">
          <option value="">Tất cả sàn</option>
          {Object.entries(PLATFORM_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <button type="submit" className="rounded-lg border px-4 py-2 text-sm hover:bg-zinc-50">Lọc</button>
        {platform && <Link href="/admin/orders" className="rounded-lg border px-4 py-2 text-sm hover:bg-zinc-50">Xóa lọc</Link>}
      </form>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-zinc-600">Mã đơn</th>
              <th className="text-left px-4 py-3 font-medium text-zinc-600">Sàn</th>
              <th className="text-left px-4 py-3 font-medium text-zinc-600">Sản phẩm</th>
              <th className="text-left px-4 py-3 font-medium text-zinc-600">Tổng SL</th>
              <th className="text-left px-4 py-3 font-medium text-zinc-600">Trạng thái</th>
              <th className="text-left px-4 py-3 font-medium text-zinc-600">Ngày đặt</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((o) => {
              const totalQty = o.items.reduce((s, it) => s + it.quantity, 0);
              return (
                <tr key={o.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-3">
                    <div className="font-mono text-xs text-zinc-500">{o.externalId || `#${o.id}`}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="capitalize text-xs bg-zinc-100 rounded-full px-2 py-0.5">{o.platform}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs text-zinc-600 line-clamp-2">
                      {o.items.map(it => it.product.title).join(", ")}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{totalQty}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs rounded-full px-2 py-0.5 ${STATUS_COLORS[o.status] ?? "bg-zinc-100 text-zinc-600"}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-400">
                    {new Date(o.orderedAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Link href={`/admin/orders/${o.id}`} className="text-xs text-rose-600 hover:underline">Sửa</Link>
                      <DeleteButton id={o.id} type="orders" label={o.externalId ?? `#${o.id}`} />
                    </div>
                  </td>
                </tr>
              );
            })}
            {orders.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-zinc-400">Chưa có đơn hàng.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="mt-4 flex gap-2">
          {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
            <Link key={p} href={`/admin/orders?platform=${platform}&page=${p}`}
              className={`rounded-lg px-3 py-1.5 text-sm border ${p === page ? "bg-rose-600 text-white border-rose-600" : "hover:bg-zinc-50"}`}>
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
