import Link from "next/link";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { logout } from "@/actions/auth";

export default async function Header() {
  const cookieStore = await cookies();
  const session = await decrypt(cookieStore.get("session")?.value);

  const isAuthenticated = !!session?.userId;
  const role = session?.role;

  return (
    <header className="flex items-center justify-between border-b border-stone-300/70 px-6 py-5 sm:px-10 lg:px-12">
      <Link href="/">
        <p className="text-xs uppercase tracking-[0.4em] text-stone-500">
          Serene Stay
        </p>
      </Link>
      <nav className="flex items-center gap-4 text-sm text-stone-600">
        <Link href="/" className="transition hover:text-stone-900">
          Home
        </Link>
        <Link href="/rooms" className="transition hover:text-stone-900">
          Rooms
        </Link>
        <Link href="/about" className="transition hover:text-stone-900">
          About
        </Link>
        {isAuthenticated ? (
          <>
            {role === "ADMIN" && (
              <Link href="/admin" className="transition hover:text-stone-900">
                Admin
              </Link>
            )}
            <Link
              href="/dashboard"
              className="transition hover:text-stone-900"
            >
              Dashboard
            </Link>
            <form action={logout} className="inline">
              <button
                type="submit"
                className="transition hover:text-stone-900"
              >
                Logout
              </button>
            </form>
          </>
        ) : (
          <Link href="/login" className="transition hover:text-stone-900">
            Sign in
          </Link>
        )}
      </nav>
    </header>
  );
}
