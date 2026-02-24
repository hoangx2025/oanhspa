"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type S3Config = {
  id: number; label: string; bucket: string; region: string;
  accessKeyId: string; secretAccessKey: string; endpoint: string | null; isDefault: boolean;
};

const EMPTY: Omit<S3Config, "id" | "isDefault"> = {
  label: "default", bucket: "", region: "ap-southeast-1",
  accessKeyId: "", secretAccessKey: "", endpoint: "",
};

export default function S3ConfigManager({ initialConfigs }: { initialConfigs: S3Config[] }) {
  const router = useRouter();
  const [configs, setConfigs] = useState(initialConfigs);
  const [form, setForm] = useState({ ...EMPTY });
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const inputCls = "w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400";
  const labelCls = "block text-xs font-medium text-zinc-600 mb-1";

  function startEdit(c: S3Config) {
    setEditId(c.id);
    setForm({ label: c.label, bucket: c.bucket, region: c.region, accessKeyId: c.accessKeyId, secretAccessKey: c.secretAccessKey, endpoint: c.endpoint ?? "" });
  }

  function cancelEdit() {
    setEditId(null);
    setForm({ ...EMPTY });
    setError("");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSaving(true);
    try {
      const url = editId ? `/api/admin/s3config/${editId}` : "/api/admin/s3config";
      const res = await fetch(url, {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, endpoint: form.endpoint || null }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Lỗi"); return; }
      cancelEdit();
      router.refresh();
      // Re-fetch
      const list = await fetch("/api/admin/s3config").then((r) => r.json());
      setConfigs(list);
    } catch { setError("Có lỗi xảy ra."); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: number) {
    if (!confirm("Xóa cấu hình này?")) return;
    await fetch(`/api/admin/s3config/${id}`, { method: "DELETE" });
    const list = await fetch("/api/admin/s3config").then((r) => r.json());
    setConfigs(list);
  }

  async function setDefault(id: number) {
    await fetch(`/api/admin/s3config/${id}/default`, { method: "PUT" });
    const list = await fetch("/api/admin/s3config").then((r) => r.json());
    setConfigs(list);
  }

  return (
    <div className="space-y-6">
      {/* List */}
      {configs.length > 0 && (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Label</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Bucket</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Region</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">Mặc định</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {configs.map((c) => (
                <tr key={c.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-3 font-medium">{c.label}</td>
                  <td className="px-4 py-3 text-zinc-500">{c.bucket}</td>
                  <td className="px-4 py-3 text-zinc-500">{c.region}</td>
                  <td className="px-4 py-3">
                    {c.isDefault ? (
                      <span className="text-xs bg-green-100 text-green-700 rounded-full px-2 py-0.5">Mặc định</span>
                    ) : (
                      <button onClick={() => setDefault(c.id)} className="text-xs text-zinc-500 hover:text-rose-600 underline">Đặt mặc định</button>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => startEdit(c)} className="text-xs text-rose-600 hover:underline">Sửa</button>
                      <button onClick={() => handleDelete(c.id)} className="text-xs text-red-500 hover:underline">Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-2xl border shadow-sm p-5">
        <h2 className="font-semibold text-zinc-800 mb-4">{editId ? "Sửa cấu hình" : "Thêm cấu hình mới"}</h2>
        {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-4">{error}</div>}
        <form onSubmit={handleSave} className="grid gap-4 md:grid-cols-2">
          <div><label className={labelCls}>Label</label><input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className={inputCls} /></div>
          <div><label className={labelCls}>Bucket *</label><input value={form.bucket} onChange={(e) => setForm({ ...form, bucket: e.target.value })} required className={inputCls} /></div>
          <div><label className={labelCls}>Region *</label><input value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} required className={inputCls} placeholder="ap-southeast-1" /></div>
          <div><label className={labelCls}>Access Key ID *</label><input value={form.accessKeyId} onChange={(e) => setForm({ ...form, accessKeyId: e.target.value })} required className={inputCls} /></div>
          <div><label className={labelCls}>Secret Access Key *</label><input type="password" value={form.secretAccessKey} onChange={(e) => setForm({ ...form, secretAccessKey: e.target.value })} required className={inputCls} /></div>
          <div><label className={labelCls}>Endpoint (tùy chọn)</label><input value={form.endpoint ?? ""} onChange={(e) => setForm({ ...form, endpoint: e.target.value })} className={inputCls} placeholder="https://..." /></div>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" disabled={saving} className="rounded-lg bg-rose-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50">
              {saving ? "Đang lưu..." : editId ? "Cập nhật" : "Thêm"}
            </button>
            {editId && (
              <button type="button" onClick={cancelEdit} className="rounded-lg border px-6 py-2.5 text-sm hover:bg-zinc-50">Hủy</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
