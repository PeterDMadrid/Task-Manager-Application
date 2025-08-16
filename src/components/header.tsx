"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  fetchCurrentUser,
  logoutUser,
  CurrentUser,
} from "@/services/authService";
import { Menu, X } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const updateUser = async () => {
    const currentUser = await fetchCurrentUser();
    setUser(currentUser);
  }

  const handleLogout = async () => {
    const success = await logoutUser();
    if (success) {
      setUser(null);
      window.dispatchEvent(new CustomEvent("auth-change"));
      router.push("/auth");
    }
  };

  useEffect(() => {
    updateUser();

    window.addEventListener("auth-change", updateUser);
    window.addEventListener("focus", updateUser);

    return () => {
      window.removeEventListener("auth-change", updateUser);
      window.removeEventListener("focus", updateUser);
    };
  }, []);

  return (
    <header className="bg-black text-white p-4 flex items-center justify-between my-custom-font relative">
      {/* Logo / Title */}
      <h1 className="text-2xl font-bold">Welcome, {user?.name ?? "Guest"}</h1>

      {/* Desktop Navigation */}
      <nav className="hidden md:block">
        <ul className="flex space-x-6 text-gray-300 text-[18px]">
          <li>
            <Link href="/create" className="hover:underline">
              Create
            </Link>
          </li>
          <li>
            <Link href="/" className="hover:underline">
              Homepage
            </Link>
          </li>
          <li>
            {user ? (
              <button
                onClick={handleLogout}
                className="hover:underline bg-transparent border-none text-gray-300 cursor-pointer"
                type="button"
              >
                Logout
              </button>
            ) : (
              <Link href="/auth" className="hover:underline">
                Sign In
              </Link>
            )}
          </li>
        </ul>
      </nav>

      {/* Mobile Burger Icon */}
      <button
        className="md:hidden text-gray-300"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle Menu"
        type="button"
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <nav className="absolute top-full left-0 w-full bg-black shadow-lg md:hidden z-50">
          <ul className="flex flex-col space-y-4 p-4 text-gray-300 text-lg">
            <li>
              <Link
                href="/create"
                className="hover:underline"
                onClick={() => setMenuOpen(false)}
              >
                Create
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="hover:underline"
                onClick={() => setMenuOpen(false)}
              >
                Homepage
              </Link>
            </li>
            <li>
              {user ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="hover:underline bg-transparent border-none text-gray-300 cursor-pointer"
                  type="button"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/auth"
                  className="hover:underline"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
