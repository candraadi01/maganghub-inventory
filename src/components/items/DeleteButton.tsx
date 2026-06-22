"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteButton({ itemId }: { itemId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = confirm("Yakin ingin menghapus item ini?");
    if (!confirmed) return;

    setLoading(true);
    const response = await fetch(`/api/items/${itemId}`, {
      method: "DELETE"
    });
    setLoading(false);

    if (!response.ok) {
      alert("Gagal menghapus item.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="rounded-xl border border-red-200 px-4 py-2 font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
    >
      {loading ? "Menghapus..." : "Hapus"}
    </button>
  );
}
