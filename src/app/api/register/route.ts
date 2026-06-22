import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").toLowerCase().trim();
    const password = String(body.password ?? "");

    if (name.length < 2) {
      return NextResponse.json({ message: "Nama minimal 2 karakter." }, { status: 400 });
    }

    if (!email.includes("@")) {
      return NextResponse.json({ message: "Email tidak valid." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ message: "Password minimal 6 karakter." }, { status: 400 });
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email sudah terdaftar." }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });

    return NextResponse.json({ message: "Register berhasil." }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Terjadi kesalahan server." }, { status: 500 });
  }
}
