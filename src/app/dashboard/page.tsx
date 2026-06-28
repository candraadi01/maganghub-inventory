import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { serializeMongo } from "@/lib/serialize";
import Item from "@/models/Item";
import Navbar from "@/components/Navbar";
import StatusBadge from "@/components/items/StatusBadge";
import DashboardFilters from "@/components/items/DashboardFilters";

type DashboardSearchParams = Promise<{
  category?: string | string[];
  status?: string | string[];
  sort?: string | string[];
}>;

type ItemList = {
  _id: string;
  title: string;
  category: string;
  status: string;
  description: string;
  activityDate?: string;
  imageUrl?: string;
  createdAt: string;
};

function getParam(value?: string | string[]) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function formatDate(value?: string) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function getTime(value?: string) {
  if (!value) return 0;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 0;

  return date.getTime();
}

function sortItems(items: ItemList[], sort: string) {
  const statusPriority: Record<string, number> = {
    Progress: 1,
    Draft: 2,
    Done: 3,
  };

  return [...items].sort((a, b) => {
    const dateA = getTime(a.activityDate ?? a.createdAt);
    const dateB = getTime(b.activityDate ?? b.createdAt);

    if (sort === "newest") {
      return dateB - dateA;
    }

    if (sort === "oldest") {
      return dateA - dateB;
    }

    const statusA = statusPriority[a.status] ?? 99;
    const statusB = statusPriority[b.status] ?? 99;

    if (statusA !== statusB) {
      return statusA - statusB;
    }

    return dateB - dateA;
  });
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: DashboardSearchParams;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const params = await searchParams;

  const category = getParam(params.category) || "Semua";
  const status = getParam(params.status) || "Semua";
  const sort = getParam(params.sort) || "status-priority";

  const query: Record<string, unknown> = {
    createdBy: session.user.id,
  };

  if (category !== "Semua") {
    query.category = {
      $regex: `^${escapeRegex(category)}$`,
      $options: "i",
    };
  }

  if (status !== "Semua") {
    query.status = status;
  }

  await connectDB();

  const data = await Item.find(query).lean();

  const items = serializeMongo<ItemList[]>(data as unknown as ItemList[]);
  const sortedItems = sortItems(items, sort);

  return (
    <main>
      <Navbar />

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
          <div>
            <p className="text-sm font-medium text-slate-500">Dashboard</p>
            <h1 className="text-3xl font-bold text-slate-950">
              Inventaris Magang
            </h1>
            <p className="mt-2 max-w-xl text-slate-600">
              Kelola semua data item, tugas, dokumen, dan aset milik akun kamu.
            </p>

            <p className="mt-6 text-sm text-slate-600">
              Menampilkan{" "}
              <span className="font-bold text-slate-900">
                {sortedItems.length}
              </span>{" "}
              data.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <DashboardFilters
              category={category}
              status={status}
              sort={sort}
            />

            <Link
              href="/items/new"
              className="flex h-11 items-center justify-center rounded-xl bg-slate-900 px-5 text-center text-sm font-semibold text-white hover:bg-slate-800"
            >
              + Tambah Item
            </Link>
          </div>
        </div>

        {sortedItems.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed bg-white p-10 text-center">
            <h2 className="text-xl font-bold text-slate-900">
              Data tidak ditemukan
            </h2>
            <p className="mt-2 text-slate-600">
              Coba ubah kategori, status, atau urutan filter.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {sortedItems.map((item) => (
              <Link
                key={item._id}
                href={`/items/${item._id}`}
                className="overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-44 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-44 items-center justify-center bg-slate-200 text-slate-500">
                    Tidak ada gambar
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-500">
                      {item.category}
                    </p>
                    <StatusBadge status={item.status} />
                  </div>

                  <p className="mt-3 text-xs font-medium text-slate-500">
                    Tanggal kegiatan:{" "}
                    {formatDate(item.activityDate ?? item.createdAt)}
                  </p>

                  <h2 className="mt-2 line-clamp-2 text-xl font-bold text-slate-950">
                    {item.title}
                  </h2>

                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}