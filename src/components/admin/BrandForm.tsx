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
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const inputCls = "w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400";
  const labelCls = "block text-xs font-medium text-zinc-600 mb-1";

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const presignRes = await fetch(
        `/api/admin/s3/presign?filename=${encodeURIComponent(file.name)}&mimeType=${encodeURIComponent(file.type)}`
      );
      if (!presignRes.ok) { alert("Lỗi: Chưa cấu hình S3 hoặc không có S3 config mặc định."); return; }
      const { uploadUrl, publicUrl, key, presignedGetUrl, presignedExpiry } = await presignRes.json();

      await fetch(uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });

      await fetch("/api/admin/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: publicUrl, key, name: file.name, mimeType: file.type, presignedUrl: presignedGetUrl, presignedExpiry }),
      });

      setForm((prev) => ({ ...prev, heroImage: presignedGetUrl || publicUrl }));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

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

        {/* Hero Image */}
        <div>
          <label className={labelCls}>Ảnh thương hiệu (Hero Image)</label>
          <div className="flex gap-3 items-start">
            {/* Preview */}
            <div className="w-24 h-24 shrink-0 rounded-xl border bg-zinc-50 overflow-hidden flex items-center justify-center">
              {form.heroImage ? (
                <img src={form.heroImage} alt="hero" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-zinc-400">Chưa có ảnh</span>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <label className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs cursor-pointer hover:bg-zinc-50 transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
                {uploading ? "Đang tải lên..." : "Chọn ảnh để upload"}
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
              </label>
              <input
                value={form.heroImage}
                onChange={(e) => setForm({ ...form, heroImage: e.target.value })}
                className={inputCls}
                placeholder="hoặc nhập URL ảnh thủ công..."
              />
              {form.heroImage && (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, heroImage: "" })}
                  className="text-xs text-red-500 hover:underline"
                >
                  Xóa ảnh
                </button>
              )}
            </div>
          </div>
        </div>
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
