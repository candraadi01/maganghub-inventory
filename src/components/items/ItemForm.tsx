"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const categories = ["Aset", "Aset Digital", "Dokumen", "Tugas", "Catatan"];
const statuses = ["Draft", "Progress", "Done"];

export type ItemFormValue = {
  _id?: string;
  title: string;
  category: string;
  status: "Draft" | "Progress" | "Done";
  description: string;
  activityDate?: string;
  imageUrl?: string;
  imagePublicId?: string;
};

type Props = {
  mode: "create" | "edit";
  initialValue?: ItemFormValue;
};

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function formatDateForInput(value?: string) {
  if (!value) return getTodayDate();

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return getTodayDate();

  return date.toISOString().slice(0, 10);
}

function createDefaultValue(): ItemFormValue {
  return {
    title: "",
    category: "Tugas",
    status: "Draft",
    description: "",
    activityDate: getTodayDate(),
    imageUrl: "",
    imagePublicId: "",
  };
}

export default function ItemForm({ mode, initialValue }: Props) {
  const router = useRouter();

  const [form, setForm] = useState<ItemFormValue>(() => {
    if (!initialValue) return createDefaultValue();

    return {
      ...initialValue,
      category: initialValue.category || "Tugas",
      status: initialValue.status || "Draft",
      activityDate: formatDateForInput(initialValue.activityDate),
    };
  });

  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(name: keyof ItemFormValue, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function uploadImage() {
    if (!file) {
      return {
        imageUrl: form.imageUrl ?? "",
        imagePublicId: form.imagePublicId ?? "",
      };
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message ?? "Upload gambar gagal.");
    }

    return data as { imageUrl: string; imagePublicId: string };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const imageData = await uploadImage();

      const payload = {
        ...form,
        imageUrl: imageData.imageUrl,
        imagePublicId: imageData.imagePublicId,
      };

      const url = mode === "create" ? "/api/items" : `/api/items/${form._id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Gagal menyimpan data.");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border bg-white p-6 shadow-sm">
      {error && (
        <div className="mb-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-slate-700">
            Judul Item
          </label>
          <input
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            className="mt-2 w-full rounded-xl border px-4 py-3"
            placeholder="Contoh: Setup Project Next.js"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700">
            Kategori
          </label>
          <select
            value={form.category}
            onChange={(event) => updateField("category", event.target.value)}
            className="mt-2 w-full rounded-xl border px-4 py-3"
            required
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700">
            Status
          </label>
          <select
            value={form.status}
            onChange={(event) => updateField("status", event.target.value)}
            className="mt-2 w-full rounded-xl border px-4 py-3"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700">
            Tanggal Kegiatan
          </label>
          <input
            type="date"
            value={form.activityDate}
            onChange={(event) => updateField("activityDate", event.target.value)}
            className="mt-2 w-full rounded-xl border px-4 py-3"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700">
            Upload Gambar
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="mt-2 w-full rounded-xl border px-4 py-3"
          />
          <p className="mt-1 text-xs text-slate-500">
            Maksimal 3 MB. File akan disimpan di Cloudinary.
          </p>
        </div>
      </div>

      <label className="mt-5 block text-sm font-semibold text-slate-700">
        Deskripsi
      </label>
      <textarea
        value={form.description}
        onChange={(event) => updateField("description", event.target.value)}
        className="mt-2 min-h-36 w-full rounded-xl border px-4 py-3"
        placeholder="Tulis detail item atau tugas magang di sini."
        required
      />

      {form.imageUrl && (
        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold text-slate-700">
            Preview gambar saat ini
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={form.imageUrl}
            alt={form.title}
            className="h-48 rounded-2xl border object-cover"
          />
        </div>
      )}

      <button
        disabled={loading}
        className="mt-6 rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Menyimpan..." : mode === "create" ? "Tambah Item" : "Simpan Perubahan"}
      </button>
    </form>
  );
}