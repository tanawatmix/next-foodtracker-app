'use client'; // <-- This directive is necessary for using Hooks like useState and handling form events.

import { useState, FC, FormEvent } from 'react';
import Link from 'next/link';

/**
 * LoginPage Component
 * * A page for user authentication.
 * - Features a form for Email and Password submission.
 * - Includes an alert system to display messages (e.g., successful login, incorrect password).
 * - Provides navigation links to the home and registration pages.
 */
const LoginPage: FC = () => {
  // State for managing alert messages.
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  // State for managing the type of alert (success or error).
  const [alertType, setAlertType] = useState<'success' | 'error' | null>(null);

  /**
   * Handles the login form submission.
   * @param e - FormEvent
   */
  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents the page from reloading on form submission.
    
    // --- This is where your actual login logic would go ---
    // Example: Validate credentials and display an alert.
    // In a real application, you would make an API call here.
    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;

    if (email === "admin@test.com" && password === "1234") {
      setAlertType('success');
      setAlertMessage('Login successful! Redirecting...');
      // TODO: Implement redirection to the dashboard here.
    } else {
      setAlertType('error');
      setAlertMessage('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-cyan-300 via-blue-400 to-purple-500 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl">
        
        {/* Link to go back to the Home page */}
        <div className="mb-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-700 hover:underline transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back!</h1>
          <p className="text-gray-500">Log in to continue tracking.</p>
        </div>

        {/* Alert Message Display */}
        {alertMessage && (
          <div
            className={`p-4 rounded-md text-sm ${
              alertType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
            role="alert"
          >
            <span className="font-medium">{alertType === 'success' ? 'Success!' : 'Error!'}</span> {alertMessage}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
          {/* Input: Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Login
            </button>
          </div>
        </form>

        <hr className="my-6 border-gray-300" />

        {/* Link to Register */}
        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;