"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  
  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth");
  }

  return (
  <header className="bg-black text-white p-4 flex justify-between my-custom-font">
      <h1 className="text-2xl font-bold">Welcome, User</h1>
      <nav className="mt-2 text-[18px]">
        <ul className="flex space-x-6 text-gray-300">
          <li><Link href="/create" className="hover:underline">Create</Link></li>
          <li><Link href="/" className="hover:underline">Homepage</Link></li>
          <li>
            <button
              onClick={handleLogout}
              className="hover:underline bg-transparent border-none text-gray-300 cursor-pointer"
              type="button"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}