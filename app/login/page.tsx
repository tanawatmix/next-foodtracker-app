'use client';

import { useState, FC, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/SupabaseClient'; // แก้ไขชื่อไฟล์เป็นตัวพิมพ์เล็ก

const LoginPage: FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;

    try {
      // MODIFIED: เพิ่ม email และ gender ใน select statement
      const { data, error: selectError } = await supabase
        .from('user_tb')
        .select('id, fullname, email, gender, user_image_url')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (selectError) {
        throw new Error('Invalid email or password.');
      }

      localStorage.setItem('food_tracker_user', JSON.stringify(data));
      router.push('/dashboard');

    } catch (error) {
      console.error('Login Error:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-cyan-300 via-blue-400 to-purple-500 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome Back!</h1>
        </div>
        {error && (
            <div className="p-4 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
            </div>
        )}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input id="email" name="email" type="email" required className="w-full px-4 py-2 mt-1 rounded-md bg-gray-100 border border-gray-300 outline-none" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input id="password" name="password" type="password" required className="w-full px-4 py-2 mt-1 rounded-md bg-gray-100 border border-gray-300 outline-none" />
          </div>
          <button type="submit" disabled={isLoading} className="w-full py-3 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-sm">
          Don&apos;t have an account? <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">Register here</Link>
        </p>
      </div>
    </main>
  );
};

export default LoginPage;

