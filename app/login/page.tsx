"use client";

import { useState, FC, FormEvent } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from '../../lib/SupabaseClient'; // 1. Import Supabase client

const LoginPage: FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2. Create the login handler function
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;

    try {
      // 2.1 Query the 'user_tb' table for a matching user
      const { data, error: selectError } = await supabase
        .from('user_tb')
        .select('id, fullname, user_image_url')
        .eq('email', email)
        .eq('password', password) // In a real app, use Supabase Auth for security
        .single(); // .single() expects exactly one result or throws an error

      if (selectError) {
        // This will catch "No rows found" or other query errors
        throw new Error('Invalid email or password.');
      }

      // 2.2 If successful, store user data in localStorage
      localStorage.setItem('food_tracker_user', JSON.stringify(data));

      // 2.3 Redirect to the dashboard
      router.push('/dashboard');

    } catch (error: any) {
      console.error('Login Error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-cyan-300 via-blue-400 to-purple-500 p-4">
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

        {/* 3. Add a section to display login errors */}
        {error && (
            <div className="p-4 bg-red-100 text-red-800 rounded-md text-sm font-medium" role="alert">
                {error}
            </div>
        )}

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
              required
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
              required
              className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-md outline-none"
              placeholder="••••••••"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Login'}
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
    </main>
  );
};

export default LoginPage;