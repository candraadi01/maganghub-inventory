import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-slate-200 px-3 py-1 text-sm font-medium text-slate-700">
            Next.js • TypeScript • CRUD • Auth • MongoDB • Cloudinary
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
            Aplikasi inventaris sederhana untuk tugas awal magang.
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            MagangHub Inventory membantu user mencatat item, tugas, atau aset magang lengkap dengan gambar,
            status pengerjaan, kategori, dan deskripsi.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/register" className="rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800">
              Mulai Sekarang
            </Link>
            <Link href="/login" className="rounded-2xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-white">
              Login
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="rounded-2xl bg-slate-900 p-6 text-white">
            <p className="text-sm text-slate-300">Preview fitur</p>
            <h2 className="mt-2 text-2xl font-bold">Dashboard CRUD</h2>
            <div className="mt-6 space-y-3">
              {["Tambah item", "Upload gambar", "Edit status", "Hapus data"].map((item) => (
                <div key={item} className="rounded-xl bg-white/10 p-4">
                  ✓ {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
