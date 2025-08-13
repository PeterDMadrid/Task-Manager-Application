"use client";

import { useState } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/Register";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded text-white bg-gray-800 shadow-lg">
      <h2 className="text-2xl font-bold mb-4">
        {isLogin ? "Login" : "Register"}
      </h2>

      {isLogin ? (
        <LoginForm />
      ) : (
        <RegisterForm />
      )}

      <p className="mt-4 text-sm text-gray-300">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="cursor-pointer text-blue-500 font-semibold px-2 py-1 text-white hover:bg-black hover:border hover:text-white transition-colors duration-200"
        >
          {isLogin ? "Register here" : "Login here"}
        </button>
      </p>
    </div>
  );
}
