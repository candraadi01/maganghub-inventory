import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { serializeMongo } from "@/lib/serialize";
import Item from "@/models/Item";
import Navbar from "@/components/Navbar";
import ItemForm, { ItemFormValue } from "@/components/items/ItemForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditItemPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;
  await connectDB();

  const data = await Item.findOne({ _id: id, createdBy: session.user.id }).lean();
  if (!data) notFound();

  const item = serializeMongo<ItemFormValue>(data as unknown as ItemFormValue);

  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-bold text-slate-950">Edit Item</h1>
        <p className="mt-2 text-slate-600">Ubah data item atau tugas magang.</p>
        <div className="mt-6">
          <ItemForm mode="edit" initialValue={item} />
        </div>
      </section>
    </main>
  );
}
