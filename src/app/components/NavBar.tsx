"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.replace("/login");
  };

  return (
    <nav className="w-full border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          <span className="text-[#1e0e4b]">Dev</span>
          <span className="text-[#7747ff]">Collab</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/explore" className="hover:text-[#7747ff] transition">
            Explore
          </Link>
          <Link href="/projects" className="hover:text-[#7747ff] transition">
            Projects
          </Link>
          <Link href="/collaborations" className="hover:text-[#7747ff] transition">
            Collaborations
          </Link>

          {status === "loading" ? null : session ? (
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="px-4 py-1.5 rounded-md bg-[#7747ff] text-white hover:opacity-90"
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-red-500 transition"
              >
                Logout
              </button>

              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-[#7747ff] text-white flex items-center justify-center font-semibold">
                {session.user?.username?.charAt(0).toUpperCase()}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm hover:text-[#7747ff] transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-1.5 rounded-md bg-[#7747ff] text-white hover:opacity-90"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-[#1e0e4b]"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t px-4 py-4 flex flex-col gap-3 bg-white">
          <Link href="/explore">Explore</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/collaborations">Collaborations</Link>

          {session ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <button
                onClick={handleLogout}
                className="text-left text-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;