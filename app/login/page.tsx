"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FC } from 'react';

const LoginPage: FC = () => {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); 
    router.push('/dashboard'); 
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-cyan-300 via-blue-400 to-purple-500 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl">
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-700 hover:underline transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back!</h1>
          <p className="text-gray-500">Log in to continue tracking.</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          {/* Input: Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              // REMOVED: ลบ required ออก
              className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-md outline-none"
              placeholder="you@example.com"
            />
          </div>

          {/* Input: Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              // REMOVED: ลบ required ออก
              className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-md outline-none"
              placeholder="••••••••"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Login
            </button>
          </div>
        </form>

        <hr className="my-6 border-gray-300" />

        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;