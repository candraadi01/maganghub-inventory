import { NextResponse } from "next/server";
import type { UploadApiResponse } from "cloudinary";
import { auth } from "@/auth";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "File tidak ditemukan." }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ message: "File harus berupa gambar." }, { status: 400 });
    }

    if (file.size > 3 * 1024 * 1024) {
      return NextResponse.json({ message: "Ukuran gambar maksimal 3 MB." }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "maganghub-inventory",
          resource_type: "image"
        },
        (error, uploadResult) => {
          if (error || !uploadResult) {
            reject(error ?? new Error("Upload gagal."));
            return;
          }
          resolve(uploadResult);
        }
      );

      uploadStream.end(bytes);
    });

    return NextResponse.json({
      imageUrl: result.secure_url,
      imagePublicId: result.public_id
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Upload gagal." }, { status: 500 });
  }
}
