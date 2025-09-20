import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

// REMOVED: Do not import images from the src or app directory.
// import food from './images/foodbanner.jpg';

const HomePage: React.FC = () => {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-8 text-white">
      <div className="flex flex-col items-center justify-center text-center">
        
        {/* Main Heading */}
        <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-md md:text-6xl">
          Welcome to Food Tracker
        </h1>

        {/* Subheading */}
        <p className="mt-4 text-xl font-light text-gray-200 drop-shadow-sm md:text-2xl">
          Track your meal!!!
        </p>

        {/* Image */}
        <div className="my-8">
          <Image
            src="/images/foodbanner.jpg" // MODIFIED: Use the direct path from the public folder.
            alt="Food Tracker Logo"
            width={350}
            height={300}
            className="rounded-3xl border-4 border-white shadow-lg object-cover" // Added object-cover
            priority
          />
        </div>
        

        {/* Action Buttons */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
          <Link
            href="/register"
            className="transform rounded-full bg-white px-8 py-3 font-semibold text-blue-600 shadow-lg transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-300 flex items-center justify-center"
          >
            Register
          </Link>
          <Link
            href="/login"
            className="transform rounded-full bg-black bg-opacity-20 px-10 py-3 font-semibold text-white shadow-lg backdrop-blur-md transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-opacity-30 focus:outline-none focus:ring-4 focus:ring-purple-300 flex items-center justify-center"
          >
            Login
          </Link>
        </div>
        <div className="mt-12 text-sm text-gray-200 drop-shadow-sm">
          <h1>Created by TANAWAT</h1>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
