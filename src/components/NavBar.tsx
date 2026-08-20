"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.replace("/login");
  };

  const close = () => setMenuOpen(false);

  return (
    <nav className="page-shell sticky top-0 z-50 px-4 pt-4">
      <div className="nav-island mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="display text-xl" onClick={close}>
          DEV<span className="text-ember">COLLAB</span>
        </Link>

        <div className="hidden items-center gap-6 text-xs font-medium tracking-[0.18em] uppercase md:flex">
          {session ? (
            session?.user?.role === "user" ? (
              <Link href="/see-projects" className="text-fog hover:text-paper">
                Explore
              </Link>
            ) : (
              <Link href="/create-project" className="text-fog hover:text-paper">
                New project
              </Link>
            )
          ) : null}

          {status === "loading" ? null : session ? (
            <div className="flex items-center gap-4">
              <NotificationBell />
              <Link
                href="/dashboard"
                className="cut-btn bg-ember px-4 py-2 text-ink hover:bg-ember-2"
              >
                Desk
              </Link>
              <button
                onClick={handleLogout}
                className="text-fog hover:text-ember"
              >
                Sign out
              </button>
              <Link
                href="/profile"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ember text-ember"
              >
                {session.user?.username?.charAt(0).toUpperCase()}
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-fog hover:text-paper">
                Login
              </Link>
              <Link
                href="/register"
                className="cut-btn bg-signal px-4 py-2 text-ink"
              >
                Join
              </Link>
            </div>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-paper md:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div className="nav-island mx-auto mt-2 flex max-w-6xl flex-col gap-3 px-4 py-4 text-sm md:hidden">
          {session ? (
            session?.user?.role === "user" ? (
              <Link href="/see-projects" onClick={close}>
                Explore
              </Link>
            ) : (
              <Link href="/create-project" onClick={close}>
                New project
              </Link>
            )
          ) : null}

          {session ? (
            <>
              <Link href="/dashboard" onClick={close}>
                Desk
              </Link>
              <Link href="/profile" onClick={close}>
                Profile
              </Link>
              <button onClick={handleLogout} className="text-left text-ember">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={close}>
                Login
              </Link>
              <Link href="/register" onClick={close}>
                Join
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;