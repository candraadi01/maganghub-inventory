export default function StatusBadge({ status }: { status: string }) {
  const className =
    status === "Done"
      ? "bg-green-100 text-green-700"
      : status === "Progress"
        ? "bg-blue-100 text-blue-700"
        : "bg-slate-100 text-slate-700";

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${className}`}>{status}</span>;
}
