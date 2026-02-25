"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Variant = {
  name: string; value: string; price: number | ""; compareAt: number | ""; stock: number | ""; sku: string;
};

type ImageEntry = { fileId: number; url: string; alt: string; sortOrder: number };

type Marketplace = { platform: string; productUrl: string };

type Brand = { id: number; name: string };
type Category = { id: number; name: string };
type Unit = { id: number; name: string };

type ProductData = {
  id?: number;
  handle: string; title: string; short: string; description: string;
  imageHint: string; isHot: boolean; isBest: boolean;
  flashSaleEndsAt: string; youtubeUrl: string;
  brandId: number | ""; categoryId: number | "";
  variants: Variant[]; images: ImageEntry[]; marketplaces: Marketplace[];
};

interface Props {
  brands: Brand[];
  categories: Category[];
  units: Unit[];
  initial?: Partial<ProductData> & { id?: number };
}

export default function ProductForm({ brands, categories, units, initial }: Props) {
  const router = useRouter();
  const isEdit = !!initial?.id;

  const defaultUnitName = units[0]?.name ?? "Dung tích";

  const [form, setForm] = useState<ProductData>({
    handle: initial?.handle ?? "",
    title: initial?.title ?? "",
    short: initial?.short ?? "",
    description: initial?.description ?? "",
    imageHint: initial?.imageHint ?? "",
    isHot: initial?.isHot ?? false,
    isBest: initial?.isBest ?? false,
    flashSaleEndsAt: initial?.flashSaleEndsAt ?? "",
    youtubeUrl: initial?.youtubeUrl ?? "",
    brandId: initial?.brandId ?? "",
    categoryId: initial?.categoryId ?? "",
    variants: initial?.variants ?? [{ name: defaultUnitName, value: "", price: "", compareAt: "", stock: 0, sku: "" }],
    images: initial?.images ?? [],
    marketplaces: initial?.marketplaces ?? [],
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  function setField<K extends keyof ProductData>(key: K, value: ProductData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // Variants
  function addVariant() {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, { name: defaultUnitName, value: "", price: "", compareAt: "", stock: 0, sku: "" }],
    }));
  }

  function removeVariant(i: number) {
    setForm((prev) => ({ ...prev, variants: prev.variants.filter((_, idx) => idx !== i) }));
  }

  function setVariant(i: number, field: keyof Variant, value: string | number) {
    setForm((prev) => {
      const variants = [...prev.variants];
      variants[i] = { ...variants[i], [field]: value };
      return { ...prev, variants };
    });
  }

  // Images via S3 presign
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const presignRes = await fetch(`/api/admin/s3/presign?filename=${encodeURIComponent(file.name)}&mimeType=${encodeURIComponent(file.type)}`);
        if (!presignRes.ok) { alert("Lỗi: Chưa cấu hình S3 hoặc không có S3 config mặc định."); break; }
        const { uploadUrl, publicUrl, key, presignedGetUrl, presignedExpiry } = await presignRes.json();

        await fetch(uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });

        const fileRes = await fetch("/api/admin/files", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: publicUrl,
            key,
            name: file.name,
            mimeType: file.type,
            presignedUrl: presignedGetUrl,
            presignedExpiry,
          }),
        });
        const fileRecord = await fileRes.json();

        // Use presigned GET URL for display; fallback to permanent URL
        const displayUrl = presignedGetUrl || publicUrl;

        setForm((prev) => ({
          ...prev,
          images: [...prev.images, { fileId: fileRecord.id, url: displayUrl, alt: "", sortOrder: prev.images.length }],
        }));
      }
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeImage(i: number) {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }));
  }

  // Marketplaces
  function addMarketplace() {
    setForm((prev) => ({ ...prev, marketplaces: [...prev.marketplaces, { platform: "shopee", productUrl: "" }] }));
  }

  function removeMarketplace(i: number) {
    setForm((prev) => ({ ...prev, marketplaces: prev.marketplaces.filter((_, idx) => idx !== i) }));
  }

  function setMarketplace(i: number, field: keyof Marketplace, value: string) {
    setForm((prev) => {
      const marketplaces = [...prev.marketplaces];
      marketplaces[i] = { ...marketplaces[i], [field]: value };
      return { ...prev, marketplaces };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        ...form,
        variants: form.variants.map((v) => ({
          ...v,
          price: Number(v.price) || 0,
          compareAt: v.compareAt !== "" ? Number(v.compareAt) : null,
          stock: Number(v.stock) || 0,
        })),
        images: form.images.map((img, i) => ({ fileId: img.fileId, alt: img.alt, sortOrder: i })),
      };

      const url = isEdit ? `/api/admin/products/${initial!.id}` : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Có lỗi xảy ra.");
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Có lỗi xảy ra.");
    } finally {
      setSaving(false);
    }
  }

  const inputCls = "w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400";
  const labelCls = "block text-xs font-medium text-zinc-600 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

      {/* Basic info */}
      <div className="bg-white rounded-2xl border shadow-sm p-5 space-y-4">
        <h2 className="font-semibold text-zinc-800">Thông tin cơ bản</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelCls}>Tiêu đề *</label>
            <input value={form.title} onChange={(e) => setField("title", e.target.value)} required className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Handle (URL slug) *</label>
            <input value={form.handle} onChange={(e) => setField("handle", e.target.value)} required className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Thương hiệu *</label>
            <select value={form.brandId} onChange={(e) => setField("brandId", Number(e.target.value))} required className={inputCls}>
              <option value="">-- Chọn --</option>
              {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Danh mục *</label>
            <select value={form.categoryId} onChange={(e) => setField("categoryId", Number(e.target.value))} required className={inputCls}>
              <option value="">-- Chọn --</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>Mô tả ngắn</label>
            <input value={form.short} onChange={(e) => setField("short", e.target.value)} className={inputCls} />
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>Mô tả chi tiết</label>
            <textarea value={form.description} onChange={(e) => setField("description", e.target.value)} rows={5} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>YouTube URL</label>
            <input value={form.youtubeUrl} onChange={(e) => setField("youtubeUrl", e.target.value)} className={inputCls} placeholder="https://youtu.be/..." />
          </div>
          <div>
            <label className={labelCls}>Flash Sale kết thúc</label>
            <input type="datetime-local" value={form.flashSaleEndsAt} onChange={(e) => setField("flashSaleEndsAt", e.target.value)} className={inputCls} />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.isHot} onChange={(e) => setField("isHot", e.target.checked)} className="rounded" />
              Hot
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.isBest} onChange={(e) => setField("isBest", e.target.checked)} className="rounded" />
              Best Seller
            </label>
          </div>
        </div>
      </div>

      {/* Variants */}
      <div className="bg-white rounded-2xl border shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-zinc-800">Biến thể</h2>
          <button type="button" onClick={addVariant} className="rounded-lg border px-3 py-1.5 text-xs hover:bg-zinc-50">
            + Thêm biến thể
          </button>
        </div>
        {units.length === 0 && (
          <div className="mb-3 rounded-lg bg-amber-50 border border-amber-200 px-4 py-2 text-xs text-amber-700">
            Chưa có đơn vị nào. <a href="/admin/units/new" className="underline font-medium">Thêm đơn vị</a> trước khi tạo biến thể.
          </div>
        )}
        <div className="space-y-3">
          {form.variants.map((v, i) => (
            <div key={i} className="grid grid-cols-2 gap-2 md:grid-cols-6 items-end">
              <div>
                <label className={labelCls}>Đơn vị</label>
                <select
                  value={v.name}
                  onChange={(e) => setVariant(i, "name", e.target.value)}
                  className={inputCls}
                >
                  {units.map((u) => (
                    <option key={u.id} value={u.name}>{u.name}</option>
                  ))}
                  {units.length === 0 && <option value={v.name}>{v.name}</option>}
                </select>
              </div>
              <div>
                <label className={labelCls}>Giá trị</label>
                <input value={v.value} onChange={(e) => setVariant(i, "value", e.target.value)} className={inputCls} placeholder="30ml" />
              </div>
              <div>
                <label className={labelCls}>Giá (VND)</label>
                <input type="number" value={v.price} onChange={(e) => setVariant(i, "price", e.target.value === "" ? "" : Number(e.target.value))} className={inputCls} placeholder="0" />
              </div>
              <div>
                <label className={labelCls}>Giá gốc</label>
                <input type="number" value={v.compareAt} onChange={(e) => setVariant(i, "compareAt", e.target.value === "" ? "" : Number(e.target.value))} className={inputCls} placeholder="0" />
              </div>
              <div>
                <label className={labelCls}>Tồn kho</label>
                <input type="number" value={v.stock} onChange={(e) => setVariant(i, "stock", Number(e.target.value))} className={inputCls} placeholder="0" />
              </div>
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className={labelCls}>SKU</label>
                  <input value={v.sku} onChange={(e) => setVariant(i, "sku", e.target.value)} className={inputCls} />
                </div>
                <button type="button" onClick={() => removeVariant(i)} className="mb-0.5 rounded-lg border px-2 py-2 text-xs text-red-500 hover:bg-red-50">
                  ✕
                </button>
              </div>
            </div>
          ))}
          {form.variants.length === 0 && (
            <p className="text-sm text-zinc-400">Chưa có biến thể. Nhấn &quot;Thêm biến thể&quot; để thêm.</p>
          )}
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-2xl border shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-zinc-800">Hình ảnh</h2>
          <label className={`rounded-lg border px-3 py-1.5 text-xs cursor-pointer hover:bg-zinc-50 ${uploading ? "opacity-50" : ""}`}>
            {uploading ? "Đang tải..." : "+ Upload ảnh"}
            <input type="file" accept="image/*" multiple onChange={handleFileChange} disabled={uploading} className="hidden" />
          </label>
        </div>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
          {form.images.map((img, i) => (
            <div key={i} className="relative group flex flex-col gap-1.5">
              <div className="relative aspect-square overflow-hidden rounded-xl border bg-zinc-50">
                <img
                  src={img.url}
                  alt={img.alt || ""}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1.5 right-1.5 rounded-full bg-red-500 text-white w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow"
                >
                  ✕
                </button>
                {i === 0 && (
                  <span className="absolute bottom-1.5 left-1.5 rounded-full bg-zinc-900/70 px-2 py-0.5 text-[10px] text-white">Chính</span>
                )}
              </div>
              <input
                value={img.alt}
                onChange={(e) => {
                  const images = [...form.images];
                  images[i] = { ...images[i], alt: e.target.value };
                  setField("images", images);
                }}
                placeholder="Alt text"
                className="w-full text-xs rounded-lg border px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-rose-400"
              />
            </div>
          ))}
          {form.images.length === 0 && (
            <div className="col-span-full py-8 text-center text-sm text-zinc-400">Chưa có ảnh. Upload ảnh để bắt đầu.</div>
          )}
        </div>
      </div>

      {/* Marketplace links */}
      <div className="bg-white rounded-2xl border shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-zinc-800">Kênh bán hàng</h2>
          <button type="button" onClick={addMarketplace} className="rounded-lg border px-3 py-1.5 text-xs hover:bg-zinc-50">
            + Thêm kênh
          </button>
        </div>
        <div className="space-y-3">
          {form.marketplaces.map((m, i) => (
            <div key={i} className="flex gap-2 items-end">
              <div className="w-40">
                <label className={labelCls}>Kênh</label>
                <select value={m.platform} onChange={(e) => setMarketplace(i, "platform", e.target.value)} className={inputCls}>
                  <option value="shopee">Shopee</option>
                  <option value="lazada">Lazada</option>
                  <option value="tiki">Tiki</option>
                  <option value="sendo">Sendo</option>
                  <option value="website">Website</option>
                  <option value="other">Khác</option>
                </select>
              </div>
              <div className="flex-1">
                <label className={labelCls}>URL sản phẩm</label>
                <input value={m.productUrl} onChange={(e) => setMarketplace(i, "productUrl", e.target.value)} className={inputCls} placeholder="https://..." />
              </div>
              <button type="button" onClick={() => removeMarketplace(i)} className="mb-0.5 rounded-lg border px-2 py-2 text-xs text-red-500 hover:bg-red-50">
                ✕
              </button>
            </div>
          ))}
          {form.marketplaces.length === 0 && (
            <p className="text-sm text-zinc-400">Chưa có kênh bán hàng.</p>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-rose-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50 transition-colors"
        >
          {saving ? "Đang lưu..." : isEdit ? "Cập nhật sản phẩm" : "Tạo sản phẩm"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="rounded-lg border px-6 py-2.5 text-sm hover:bg-zinc-50 transition-colors"
        >
          Hủy
        </button>
      </div>
    </form>
  );
}
