import Link from "next/link";
import { auth, signOut } from "@/auth";

export default async function Navbar() {
  const session = await auth();

  return (
    <header className="border-b bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold text-slate-900">
          MagangHub
        </Link>

        <div className="flex items-center gap-3 text-sm">
          {session?.user ? (
            <>
              <span className="hidden text-slate-600 sm:inline">{session.user.email}</span>
              <Link
                href="/dashboard"
                className="rounded-xl border px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
              >
                Dashboard
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/login" });
                }}
              >
                <button className="rounded-xl bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-800">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-xl border px-4 py-2 font-medium text-slate-700 hover:bg-slate-50">
                Login
              </Link>
              <Link href="/register" className="rounded-xl bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-800">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
