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

      <p className="mt-4 text-sm">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-600 underline"
        >
          {isLogin ? "Register here" : "Login here"}
        </button>
      </p>
    </div>
  );
}
