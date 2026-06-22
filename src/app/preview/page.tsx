"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";

type Item = {
  id: string;
  title: string;
  category: string;
  status: string;
  description: string;
  imageUrl?: string;
};

const initialItems: Item[] = [
  {
    id: "1",
    title: "Laptop Kantor",
    category: "Aset",
    status: "Progress",
    description: "Laptop yang digunakan untuk mengerjakan tugas harian selama magang.",
  },
  {
    id: "2",
    title: "Dokumen Briefing",
    category: "Dokumen",
    status: "Done",
    description: "Dokumen arahan awal dari pembimbing untuk kebutuhan pekerjaan magang.",
  },
  {
    id: "3",
    title: "Tugas Landing Page",
    category: "Tugas",
    status: "Draft",
    description: "Pembuatan tampilan halaman awal aplikasi menggunakan Next.js dan Tailwind CSS.",
  },
];

export default function PreviewPage() {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const [form, setForm] = useState({
    title: "",
    category: "",
    status: "Draft",
    description: "",
    imageUrl: "",
  });

  useEffect(() => {
    const savedItems = localStorage.getItem("preview-items");
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("preview-items", JSON.stringify(items));
  }, [items]);

  function openAddForm() {
    setEditingItem(null);
    setForm({
      title: "",
      category: "",
      status: "Draft",
      description: "",
      imageUrl: "",
    });
    setIsFormOpen(true);
  }

  function openEditForm(item: Item) {
    setEditingItem(item);
    setForm({
      title: item.title,
      category: item.category,
      status: item.status,
      description: item.description,
      imageUrl: item.imageUrl || "",
    });
    setIsFormOpen(true);
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        imageUrl: reader.result as string,
      }));
    };

    reader.readAsDataURL(file);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.title || !form.category || !form.description) {
      alert("Nama item, kategori, dan deskripsi wajib diisi.");
      return;
    }

    if (editingItem) {
      const updatedItems = items.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              title: form.title,
              category: form.category,
              status: form.status,
              description: form.description,
              imageUrl: form.imageUrl,
            }
          : item
      );

      setItems(updatedItems);
    } else {
      const newItem: Item = {
        id: Date.now().toString(),
        title: form.title,
        category: form.category,
        status: form.status,
        description: form.description,
        imageUrl: form.imageUrl,
      };

      setItems([newItem, ...items]);
    }

    setIsFormOpen(false);
  }

  function handleDelete(id: string) {
    const confirmDelete = confirm("Yakin ingin menghapus item ini?");
    if (!confirmDelete) return;

    setItems(items.filter((item) => item.id !== id));
  }

  function resetData() {
    localStorage.removeItem("preview-items");
    setItems(initialItems);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <h1 className="text-2xl font-bold tracking-wide">MagangHub</h1>

          <div className="flex gap-3">
            <button className="rounded-xl border border-slate-900 px-5 py-2 font-semibold">
              Login
            </button>
            <button className="rounded-xl bg-slate-950 px-5 py-2 font-semibold text-white">
              Register
            </button>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="font-semibold text-slate-500">Preview Dashboard</p>
            <h2 className="mt-2 text-4xl font-bold">MagangHub Inventory</h2>
            <p className="mt-3 text-lg text-slate-600">
              Ini adalah mode demo untuk mencoba fitur CRUD tanpa login dan tanpa database.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={resetData}
              className="rounded-xl border border-slate-300 px-5 py-3 font-semibold hover:bg-slate-100"
            >
              Reset Data
            </button>

            <button
              onClick={openAddForm}
              className="rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white hover:bg-slate-800"
            >
              + Tambah Item
            </button>
          </div>
        </div>

        {isFormOpen && (
          <div className="mt-8 rounded-3xl border bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-2xl font-bold">
                {editingItem ? "Edit Item" : "Tambah Item"}
              </h3>

              <button
                onClick={() => setIsFormOpen(false)}
                className="rounded-lg bg-slate-100 px-4 py-2 font-semibold"
              >
                Tutup
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-semibold">Nama Item</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-slate-900"
                  placeholder="Contoh: Laptop Kantor"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">Kategori</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-slate-900"
                  placeholder="Contoh: Aset, Dokumen, Tugas"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-slate-900"
                >
                  <option value="Draft">Draft</option>
                  <option value="Progress">Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block font-semibold">Upload Gambar</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block font-semibold">Deskripsi</label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="h-32 w-full rounded-xl border px-4 py-3 outline-none focus:border-slate-900"
                  placeholder="Tulis deskripsi item..."
                />
              </div>

              {form.imageUrl && (
                <div className="md:col-span-2">
                  <p className="mb-2 font-semibold">Preview Gambar</p>
                  <img
                    src={form.imageUrl}
                    alt="Preview"
                    className="h-52 w-full rounded-2xl object-cover"
                  />
                </div>
              )}

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white hover:bg-slate-800"
                >
                  {editingItem ? "Simpan Perubahan" : "Simpan Item"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-3xl border bg-white shadow-sm"
            >
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-56 w-full object-cover"
                />
              ) : (
                <div className="flex h-56 items-center justify-center bg-slate-200 text-slate-500">
                  Tidak ada gambar
                </div>
              )}

              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-500">{item.category}</p>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                    {item.status}
                  </span>
                </div>

                <h3 className="mt-4 text-2xl font-bold">{item.title}</h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {item.description}
                </p>

                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => openEditForm(item)}
                    className="flex-1 rounded-xl border border-slate-300 px-4 py-2 font-semibold hover:bg-slate-100"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 rounded-xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}