"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchCurrentUser, logoutUser, CurrentUser } from "@/services/authService";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);

  async function updateUser() {
    const currentUser = await fetchCurrentUser();
    setUser(currentUser);
  }

  async function handleLogout() {
    const success = await logoutUser();
    if (success) {
      setUser(null);
      window.dispatchEvent(new CustomEvent("auth-change"));
      router.push("/auth");
    }
  }

  useEffect(() => {
    updateUser();

    const handleAuthChange = () => updateUser();
    window.addEventListener("auth-change", handleAuthChange);
    window.addEventListener("focus", updateUser);

    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
      window.removeEventListener("focus", updateUser);
    };
  }, []);

  return (
    <header className="bg-black text-white p-4 flex justify-between my-custom-font">
      <h1 className="text-2xl font-bold">Welcome, {user?.name ?? "Guest"}</h1>
      <nav className="mt-2 text-[18px]">
        <ul className="flex space-x-6 text-gray-300">
          <li><Link href="/create" className="hover:underline">Create</Link></li>
          <li><Link href="/" className="hover:underline">Homepage</Link></li>
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
              <Link href="/auth" className="hover:underline">Sign In</Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
