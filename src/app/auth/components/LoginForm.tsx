"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/services/auth";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name")?.toString();
    const password = formData.get("password")?.toString();

    if (!name || !password) {
      setError("Name and password are required");
      setLoading(false);
      return;
    }

    try {
      await login(name, password); // call service
      router.push("/"); // navigate after successful login
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" type="text" placeholder="Username" className="border p-2 w-full mb-2" required />
      <input name="password" type="password" placeholder="Password" className="border p-2 w-full mb-2" required />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded">
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
