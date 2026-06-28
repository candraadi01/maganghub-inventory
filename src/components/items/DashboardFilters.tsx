import Link from "next/link";

const categories = ["Semua", "Aset", "Aset Digital", "Dokumen", "Tugas", "Catatan"];
const statuses = ["Semua", "Draft", "Progress", "Done"];

const sortOptions = [
  { label: "Prioritas Status", value: "status-priority" },
  { label: "Tanggal Terbaru", value: "newest" },
  { label: "Tanggal Terlama", value: "oldest" },
];

type Props = {
  category: string;
  status: string;
  sort: string;
};

export default function DashboardFilters({ category, status, sort }: Props) {
  const isActive =
    category !== "Semua" || status !== "Semua" || sort !== "status-priority";

  return (
    <div className="relative">
      <details className="group">
        <summary className="flex h-11 cursor-pointer list-none items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 [&::-webkit-details-marker]:hidden">
          Filter
          {isActive && (
            <span className="rounded-full bg-slate-900 px-2 py-0.5 text-xs text-white">
              Aktif
            </span>
          )}
        </summary>

        <div className="absolute right-0 z-30 mt-3 w-72 rounded-2xl border bg-white p-4 shadow-xl">
          <form action="/dashboard" className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Kategori
              </label>
              <select
                name="category"
                defaultValue={category}
                className="mt-2 h-11 w-full rounded-xl border px-3 text-sm outline-none focus:border-slate-900"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Status
              </label>
              <select
                name="status"
                defaultValue={status}
                className="mt-2 h-11 w-full rounded-xl border px-3 text-sm outline-none focus:border-slate-900"
              >
                {statuses.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Urutkan
              </label>
              <select
                name="sort"
                defaultValue={sort}
                className="mt-2 h-11 w-full rounded-xl border px-3 text-sm outline-none focus:border-slate-900"
              >
                {sortOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Terapkan
              </button>

              <Link
                href="/dashboard"
                className="flex-1 rounded-xl border px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Reset
              </Link>
            </div>
          </form>
        </div>
      </details>
    </div>
  );
}