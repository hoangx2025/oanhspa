"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type OrderItem = {
  productId: number | "";
  productTitle: string;
  variantId: number | "";
  quantity: number;
  price: number | "";
};

type Product = { id: number; title: string; variants: { id: number; name: string; value: string; price: number }[] };

interface Props {
  products: Product[];
  initial?: {
    id?: number;
    platform: string;
    externalId: string;
    orderedAt: string;
    status: string;
    note: string;
    items: OrderItem[];
  };
}

const PLATFORMS = ["shopee", "lazada", "tiki", "sendo", "website", "other"];
const STATUSES  = ["completed", "pending", "cancelled", "returned"];

export default function OrderForm({ products, initial }: Props) {
  const router = useRouter();
  const isEdit = !!initial?.id;

  const [form, setForm] = useState({
    platform:   initial?.platform   ?? "shopee",
    externalId: initial?.externalId ?? "",
    orderedAt:  initial?.orderedAt  ?? new Date().toISOString().slice(0, 16),
    status:     initial?.status     ?? "completed",
    note:       initial?.note       ?? "",
  });
  const [items, setItems] = useState<OrderItem[]>(
    initial?.items ?? [{ productId: "", productTitle: "", variantId: "", quantity: 1, price: "" }]
  );
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");

  const inputCls = "w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400";
  const labelCls = "block text-xs font-medium text-zinc-600 mb-1";

  function addItem() {
    setItems(prev => [...prev, { productId: "", productTitle: "", variantId: "", quantity: 1, price: "" }]);
  }

  function removeItem(i: number) {
    setItems(prev => prev.filter((_, idx) => idx !== i));
  }

  function setItemField(i: number, field: keyof OrderItem, value: string | number) {
    setItems(prev => {
      const next = [...prev];
      if (field === "productId") {
        const prod = products.find(p => p.id === Number(value));
        const firstV = prod?.variants[0];
        next[i] = {
          ...next[i],
          productId: Number(value) || "",
          productTitle: prod?.title ?? "",
          variantId: firstV?.id ?? "",
          price: firstV?.price ?? "",
        };
      } else if (field === "variantId") {
        const prod = products.find(p => p.id === next[i].productId);
        const v = prod?.variants.find(v => v.id === Number(value));
        next[i] = { ...next[i], variantId: Number(value) || "", price: v?.price ?? next[i].price };
      } else {
        (next[i] as Record<string, unknown>)[field] = value;
      }
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.some(it => !it.productId)) { setError("Vui lòng chọn sản phẩm cho tất cả các dòng."); return; }
    setError(""); setSaving(true);
    try {
      const url    = isEdit ? `/api/admin/orders/${initial!.id}` : "/api/admin/orders";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map(it => ({
            productId: it.productId,
            variantId: it.variantId || null,
            quantity: Number(it.quantity) || 1,
            price: Number(it.price) || 0,
          })),
        }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Lỗi"); return; }
      router.push("/admin/orders");
      router.refresh();
    } catch { setError("Có lỗi xảy ra."); }
    finally { setSaving(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

      {/* Order info */}
      <div className="bg-white rounded-2xl border shadow-sm p-5">
        <h2 className="font-semibold text-zinc-800 mb-4">Thông tin đơn hàng</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className={labelCls}>Sàn / Kênh bán *</label>
            <select value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })} className={inputCls}>
              {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Mã đơn hàng (trên sàn)</label>
            <input value={form.externalId} onChange={e => setForm({ ...form, externalId: e.target.value })} className={inputCls} placeholder="SHP-123456789" />
          </div>
          <div>
            <label className={labelCls}>Ngày đặt hàng *</label>
            <input type="datetime-local" value={form.orderedAt} onChange={e => setForm({ ...form, orderedAt: e.target.value })} required className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Trạng thái</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className={inputCls}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>Ghi chú</label>
            <input value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} className={inputCls} />
          </div>
        </div>
      </div>

      {/* Order items */}
      <div className="bg-white rounded-2xl border shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-zinc-800">Sản phẩm trong đơn</h2>
          <button type="button" onClick={addItem} className="rounded-lg border px-3 py-1.5 text-xs hover:bg-zinc-50">
            + Thêm sản phẩm
          </button>
        </div>
        <div className="space-y-3">
          {items.map((item, i) => {
            const prod = products.find(p => p.id === item.productId);
            return (
              <div key={i} className="grid grid-cols-2 gap-2 md:grid-cols-5 items-end">
                <div className="md:col-span-2">
                  <label className={labelCls}>Sản phẩm *</label>
                  <select
                    value={item.productId}
                    onChange={e => setItemField(i, "productId", e.target.value)}
                    required
                    className={inputCls}
                  >
                    <option value="">-- Chọn sản phẩm --</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Biến thể</label>
                  <select
                    value={item.variantId}
                    onChange={e => setItemField(i, "variantId", e.target.value)}
                    className={inputCls}
                    disabled={!prod}
                  >
                    <option value="">-- --</option>
                    {prod?.variants.map(v => (
                      <option key={v.id} value={v.id}>{v.name}: {v.value}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Số lượng</label>
                  <input
                    type="number" min={1}
                    value={item.quantity}
                    onChange={e => setItemField(i, "quantity", Number(e.target.value))}
                    className={inputCls}
                  />
                </div>
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <label className={labelCls}>Giá (VND)</label>
                    <input
                      type="number"
                      value={item.price}
                      onChange={e => setItemField(i, "price", e.target.value === "" ? "" : Number(e.target.value))}
                      className={inputCls}
                    />
                  </div>
                  <button type="button" onClick={() => removeItem(i)} className="mb-0.5 rounded-lg border px-2 py-2 text-xs text-red-500 hover:bg-red-50">
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
          {items.length === 0 && <p className="text-sm text-zinc-400">Chưa có sản phẩm nào.</p>}
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="rounded-lg bg-rose-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50">
          {saving ? "Đang lưu..." : isEdit ? "Cập nhật đơn" : "Tạo đơn hàng"}
        </button>
        <button type="button" onClick={() => router.push("/admin/orders")} className="rounded-lg border px-6 py-2.5 text-sm hover:bg-zinc-50">
          Hủy
        </button>
      </div>
    </form>
  );
}
