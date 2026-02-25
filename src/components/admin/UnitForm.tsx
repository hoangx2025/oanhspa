"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type UnitData = { id?: number; name: string };
interface Props { initial?: UnitData }

export default function UnitForm({ initial }: Props) {
  const router = useRouter();
  const isEdit = !!initial?.id;
  const [name, setName] = useState(initial?.name ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const inputCls = "w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400";
  const labelCls = "block text-xs font-medium text-zinc-600 mb-1";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSaving(true);
    try {
      const url = isEdit ? `/api/admin/units/${initial!.id}` : "/api/admin/units";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Lỗi"); return; }
      router.push("/admin/units"); router.refresh();
    } catch { setError("Có lỗi xảy ra."); }
    finally { setSaving(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-sm">
      {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
      <div className="bg-white rounded-2xl border shadow-sm p-5 space-y-4">
        <div>
          <label className={labelCls}>Tên đơn vị *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={inputCls}
            placeholder="VD: Dung tích, Màu sắc, Kích thước..."
          />
        </div>
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="rounded-lg bg-rose-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50">
          {saving ? "Đang lưu..." : isEdit ? "Cập nhật" : "Tạo mới"}
        </button>
        <button type="button" onClick={() => router.push("/admin/units")} className="rounded-lg border px-6 py-2.5 text-sm hover:bg-zinc-50">Hủy</button>
      </div>
    </form>
  );
}
