# MagangHub Inventory

Aplikasi web sederhana untuk tugas awal magang: CRUD inventaris/tugas/aset dengan autentikasi, MongoDB Atlas, upload gambar Cloudinary, Tailwind CSS, dan Next.js TypeScript.

## Fitur

- Register dan login email/password menggunakan Auth.js / NextAuth.
- Session JWT.
- CRUD item inventaris: tambah, lihat, edit, hapus.
- Data tiap user dipisahkan berdasarkan akun login.
- Upload gambar item ke Cloudinary.
- Database MongoDB Atlas.
- UI responsive dengan Tailwind CSS.

## Tech Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- Auth.js / NextAuth Credentials Provider
- MongoDB Atlas + Mongoose
- Cloudinary

## Cara Menjalankan di Lokal

### 1. Install dependency

```bash
npm install
```

### 2. Buat file `.env.local`

Salin dari `.env.example`, lalu isi value asli dari MongoDB Atlas dan Cloudinary.

```bash
cp .env.example .env.local
```

Isi contoh:

```env
MONGODB_URI="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/maganghub?retryWrites=true&w=majority"
AUTH_SECRET="isi_random_minimal_32_karakter"
AUTH_URL="http://localhost:3000"
CLOUDINARY_CLOUD_NAME="cloud_name_kamu"
CLOUDINARY_API_KEY="api_key_kamu"
CLOUDINARY_API_SECRET="api_secret_kamu"
```

Generate `AUTH_SECRET`:

```bash
npx auth secret
```

Atau pakai:

```bash
openssl rand -base64 33
```

### 3. Jalankan project

```bash
npm run dev
```

Buka:

```bash
http://localhost:3000
```

## Cara Push ke GitHub Public

```bash
git init
git add .
git commit -m "initial commit maganghub inventory"
git branch -M main
git remote add origin https://github.com/USERNAME/maganghub-inventory.git
git push -u origin main
```

Pastikan repository di GitHub diset **Public**.

## Catatan Deployment

Jika deploy ke Vercel, masukkan semua environment variables dari `.env.local` ke menu:

`Project Settings > Environment Variables`

Untuk production, ubah:

```env
AUTH_URL="https://domain-vercel-kamu.vercel.app"
```

## Akun Demo

Aplikasi ini belum menyediakan akun default. Silakan register akun baru lewat halaman `/register`.
