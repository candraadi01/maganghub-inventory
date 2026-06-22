import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { serializeMongo } from "@/lib/serialize";
import Item from "@/models/Item";
import Navbar from "@/components/Navbar";
import StatusBadge from "@/components/items/StatusBadge";

type ItemList = {
  _id: string;
  title: string;
  category: string;
  status: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await connectDB();
  const data = await Item.find({ createdBy: session.user.id }).sort({ createdAt: -1 }).lean();
  const items = serializeMongo<ItemList[]>(data as unknown as ItemList[]);

  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-medium text-slate-500">Dashboard</p>
            <h1 className="text-3xl font-bold text-slate-950">Inventaris Magang</h1>
            <p className="mt-2 text-slate-600">Kelola semua data item/tugas/aset milik akun kamu.</p>
          </div>
          <Link href="/items/new" className="rounded-xl bg-slate-900 px-5 py-3 text-center font-semibold text-white hover:bg-slate-800">
            + Tambah Item
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed bg-white p-10 text-center">
            <h2 className="text-xl font-bold text-slate-900">Belum ada data</h2>
            <p className="mt-2 text-slate-600">Klik tombol tambah item untuk membuat data pertama.</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <Link key={item._id} href={`/items/${item._id}`} className="overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imageUrl} alt={item.title} className="h-44 w-full object-cover" />
                ) : (
                  <div className="flex h-44 items-center justify-center bg-slate-200 text-slate-500">Tidak ada gambar</div>
                )}
                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-500">{item.category}</p>
                    <StatusBadge status={item.status} />
                  </div>
                  <h2 className="mt-3 line-clamp-2 text-xl font-bold text-slate-950">{item.title}</h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
