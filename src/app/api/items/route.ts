import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Item, { ITEM_CATEGORIES, ITEM_STATUSES } from "@/models/Item";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const items = await Item.find({ createdBy: session.user.id })
    .sort({ activityDate: -1, createdAt: -1 })
    .lean();

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const title = String(body.title ?? "").trim();
    const category = String(body.category ?? "Tugas").trim();
    const status = String(body.status ?? "Draft");
    const description = String(body.description ?? "").trim();
    const imageUrl = String(body.imageUrl ?? "");
    const imagePublicId = String(body.imagePublicId ?? "");
    const activityDateInput = String(body.activityDate ?? "");
    const activityDate = activityDateInput ? new Date(activityDateInput) : new Date();

    if (title.length < 3) {
      return NextResponse.json({ message: "Judul minimal 3 karakter." }, { status: 400 });
    }

    if (description.length < 5) {
      return NextResponse.json({ message: "Deskripsi minimal 5 karakter." }, { status: 400 });
    }

    if (!ITEM_CATEGORIES.includes(category as (typeof ITEM_CATEGORIES)[number])) {
      return NextResponse.json({ message: "Kategori tidak valid." }, { status: 400 });
    }

    if (!ITEM_STATUSES.includes(status as (typeof ITEM_STATUSES)[number])) {
      return NextResponse.json({ message: "Status tidak valid." }, { status: 400 });
    }

    if (Number.isNaN(activityDate.getTime())) {
      return NextResponse.json({ message: "Tanggal kegiatan tidak valid." }, { status: 400 });
    }

    await connectDB();

    const item = await Item.create({
      title,
      category,
      status,
      description,
      activityDate,
      imageUrl,
      imagePublicId,
      createdBy: new mongoose.Types.ObjectId(session.user.id),
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal membuat item." }, { status: 500 });
  }
}