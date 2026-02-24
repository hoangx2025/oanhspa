"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  id: number | string;
  type: "products" | "brands" | "categories" | "users" | "orders";
  label?: string;
}

export default function DeleteButton({ id, type, label }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Xóa "${label || id}"?`)) return;
    setLoading(true);
    await fetch(`/api/admin/${type}/${id}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-xs text-red-500 hover:underline disabled:opacity-50"
    >
      {loading ? "..." : "Xóa"}
    </button>
  );
}
