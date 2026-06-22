"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.message ?? "Register gagal.");
      return;
    }

    router.push("/login");
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl border bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-bold text-slate-950">Register</h1>
      <p className="mt-2 text-slate-600">Buat akun baru untuk mulai menggunakan aplikasi.</p>

      {error && <div className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <label className="mt-6 block text-sm font-medium text-slate-700">Nama</label>
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        className="mt-2 w-full rounded-xl border px-4 py-3"
        placeholder="Nama kamu"
        required
      />

      <label className="mt-4 block text-sm font-medium text-slate-700">Email</label>
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="mt-2 w-full rounded-xl border px-4 py-3"
        placeholder="nama@email.com"
        required
      />

      <label className="mt-4 block text-sm font-medium text-slate-700">Password</label>
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className="mt-2 w-full rounded-xl border px-4 py-3"
        placeholder="Minimal 6 karakter"
        required
      />

      <button
        disabled={loading}
        className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Memproses..." : "Register"}
      </button>

      <p className="mt-5 text-center text-sm text-slate-600">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-semibold text-slate-900 underline">
          Login
        </Link>
      </p>
    </form>
  );
}
