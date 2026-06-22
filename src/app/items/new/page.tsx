import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Navbar from "@/components/Navbar";
import ItemForm from "@/components/items/ItemForm";

export default async function NewItemPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-bold text-slate-950">Tambah Item</h1>
        <p className="mt-2 text-slate-600">Lengkapi data item atau tugas magang yang ingin dicatat.</p>
        <div className="mt-6">
          <ItemForm mode="create" />
        </div>
      </section>
    </main>
  );
}
