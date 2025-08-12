import Link from "next/link";

export default function Header() {
  return (
  <header className="bg-black text-white p-4 flex justify-between my-custom-font">
      <h1 className="text-2xl font-bold">Task Manager</h1>
      <nav className="mt-2 text-[18px]">
        <ul className="flex space-x-8 text-gray-300">
          <li><Link href="/" className="hover:underline">Homepage</Link></li>
          <li><Link href="tasks" className="hover:underline">My Tasks</Link></li>
          <li><Link href="/logout" className="hover:underline">Logout</Link></li>
        </ul>
      </nav>
    </header>
  );
}