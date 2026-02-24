"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type BrandData = { id?: number; name: string; slug: string; tagline: string; heroNote: string; heroImage: string };

interface Props { initial?: Partial<BrandData> & { id?: number } }

export default function BrandForm({ initial }: Props) {
  const router = useRouter();
  const isEdit = !!initial?.id;
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    tagline: initial?.tagline ?? "",
    heroNote: initial?.heroNote ?? "",
    heroImage: initial?.heroImage ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const inputCls = "w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400";
  const labelCls = "block text-xs font-medium text-zinc-600 mb-1";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSaving(true);
    try {
      const url = isEdit ? `/api/admin/brands/${initial!.id}` : "/api/admin/brands";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Lỗi"); return; }
      router.push("/admin/brands"); router.refresh();
    } catch { setError("Có lỗi xảy ra."); }
    finally { setSaving(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
      <div className="bg-white rounded-2xl border shadow-sm p-5 space-y-4">
        <div><label className={labelCls}>Tên *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className={inputCls} /></div>
        <div><label className={labelCls}>Slug *</label><input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required className={inputCls} /></div>
        <div><label className={labelCls}>Tagline</label><input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className={inputCls} /></div>
        <div><label className={labelCls}>Hero Note</label><textarea value={form.heroNote} onChange={(e) => setForm({ ...form, heroNote: e.target.value })} rows={3} className={inputCls} /></div>
        <div><label className={labelCls}>Hero Image URL</label><input value={form.heroImage} onChange={(e) => setForm({ ...form, heroImage: e.target.value })} className={inputCls} /></div>
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="rounded-lg bg-rose-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50">
          {saving ? "Đang lưu..." : isEdit ? "Cập nhật" : "Tạo mới"}
        </button>
        <button type="button" onClick={() => router.push("/admin/brands")} className="rounded-lg border px-6 py-2.5 text-sm hover:bg-zinc-50">Hủy</button>
      </div>
    </form>
  );
}
