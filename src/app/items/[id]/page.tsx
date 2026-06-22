import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { serializeMongo } from "@/lib/serialize";
import Item from "@/models/Item";
import Navbar from "@/components/Navbar";
import StatusBadge from "@/components/items/StatusBadge";
import DeleteButton from "@/components/items/DeleteButton";

type PageProps = {
  params: Promise<{ id: string }>;
};

type DetailItem = {
  _id: string;
  title: string;
  category: string;
  status: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export default async function ItemDetailPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;
  await connectDB();

  const data = await Item.findOne({ _id: id, createdBy: session.user.id }).lean();
  if (!data) notFound();

  const item = serializeMongo<DetailItem>(data as unknown as DetailItem);

  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-5xl px-4 py-10">
        <Link href="/dashboard" className="text-sm font-semibold text-slate-600 hover:text-slate-950">
          ← Kembali ke dashboard
        </Link>

        <div className="mt-6 overflow-hidden rounded-3xl border bg-white shadow-sm">
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.imageUrl} alt={item.title} className="h-72 w-full object-cover" />
          ) : (
            <div className="flex h-72 items-center justify-center bg-slate-200 text-slate-500">Tidak ada gambar</div>
          )}

          <div className="p-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">{item.category}</span>
              <StatusBadge status={item.status} />
            </div>
            <h1 className="mt-4 text-3xl font-bold text-slate-950">{item.title}</h1>
            <p className="mt-4 whitespace-pre-wrap leading-8 text-slate-700">{item.description}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/items/${item._id}/edit`} className="rounded-xl bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-800">
                Edit
              </Link>
              <DeleteButton itemId={item._id} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
