import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Item from "@/models/Item";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  await connectDB();

  const item = await Item.findOne({ _id: id, createdBy: session.user.id }).lean();

  if (!item) {
    return NextResponse.json({ message: "Item tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({ item });
}

export async function PUT(request: Request, context: RouteContext) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();

    const title = String(body.title ?? "").trim();
    const category = String(body.category ?? "Umum").trim();
    const status = String(body.status ?? "Draft");
    const description = String(body.description ?? "").trim();
    const imageUrl = String(body.imageUrl ?? "");
    const imagePublicId = String(body.imagePublicId ?? "");

    if (title.length < 3) {
      return NextResponse.json({ message: "Judul minimal 3 karakter." }, { status: 400 });
    }

    if (description.length < 5) {
      return NextResponse.json({ message: "Deskripsi minimal 5 karakter." }, { status: 400 });
    }

    if (!["Draft", "Progress", "Done"].includes(status)) {
      return NextResponse.json({ message: "Status tidak valid." }, { status: 400 });
    }

    await connectDB();

    const item = await Item.findOneAndUpdate(
      { _id: id, createdBy: session.user.id },
      { title, category, status, description, imageUrl, imagePublicId },
      { new: true }
    );

    if (!item) {
      return NextResponse.json({ message: "Item tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ item });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal mengubah item." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    await connectDB();

    const item = await Item.findOneAndDelete({ _id: id, createdBy: session.user.id });

    if (!item) {
      return NextResponse.json({ message: "Item tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ message: "Item berhasil dihapus." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal menghapus item." }, { status: 500 });
  }
}
