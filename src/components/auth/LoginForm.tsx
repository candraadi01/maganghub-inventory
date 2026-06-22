"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false
    });

    setLoading(false);

    if (result?.error) {
      setError("Email atau password salah.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl border bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-bold text-slate-950">Login</h1>
      <p className="mt-2 text-slate-600">Masuk untuk mengelola data inventaris magang.</p>

      {error && <div className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <label className="mt-6 block text-sm font-medium text-slate-700">Email</label>
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
        {loading ? "Memproses..." : "Login"}
      </button>

      <p className="mt-5 text-center text-sm text-slate-600">
        Belum punya akun?{" "}
        <Link href="/register" className="font-semibold text-slate-900 underline">
          Register
        </Link>
      </p>
    </form>
  );
}
