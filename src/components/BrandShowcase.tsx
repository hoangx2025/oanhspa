import BrandShowcaseClient from "@/components/BrandShowcaseClient";

export default function BrandShowcase({
  brands,
}: {
  brands: { name: string; slug: string; tagline?: string | null; heroNote?: string | null; heroImage?: string | null }[];
}) {
  return (
    <div className="rounded-3xl border bg-white p-6 shadow-soft">
      <div className="text-sm font-semibold">Thương hiệu</div>
      <BrandShowcaseClient brands={brands} />
    </div>
  );
}
