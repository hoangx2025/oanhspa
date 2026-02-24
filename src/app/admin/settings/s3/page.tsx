import { db } from "@/lib/db";
import S3ConfigManager from "./S3ConfigManager";

export default async function S3SettingsPage() {
  const configs = await db.s3Config.findMany({ orderBy: { id: "asc" } });
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-zinc-800 mb-2">Cấu hình S3</h1>
      <p className="text-sm text-zinc-500 mb-6">Quản lý thông tin bucket S3 để upload ảnh sản phẩm.</p>
      <S3ConfigManager initialConfigs={configs} />
    </div>
  );
}
