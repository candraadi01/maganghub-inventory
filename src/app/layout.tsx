import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MagangHub Inventory",
  description: "Aplikasi CRUD sederhana untuk tugas awal magang"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
