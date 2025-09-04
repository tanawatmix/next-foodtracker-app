'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { FC } from 'react';
import type { StaticImageData } from 'next/image';
import food from '../images/foodbanner.jpg'; // สมมติว่าไฟล์รูปภาพอยู่ที่ src/images/foodbanner.jpg

// [1] กำหนด Type และสร้าง Mock Data
// --------------------------------------------------
type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

interface FoodEntry {
  id: number;
  date: string;
  name: string;
  imageUrl: StaticImageData; // Type สำหรับรูปที่ import เข้ามา
  meal: MealType;
}

const mockData: FoodEntry[] = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  date: `2025-09-04`, // ใช้วันที่ปัจจุบันเพื่อให้ข้อมูลดูสมจริง
  name: ['Chicken Salad', 'Spaghetti Carbonara', 'Avocado Toast', 'Salmon Steak', 'Fruit Smoothie'][i % 5],
  imageUrl: food, // ใช้รูปที่ import เข้ามาโดยตรง
  meal: ['Breakfast', 'Lunch', 'Dinner', 'Snack'][i % 4] as MealType,
}));
// --------------------------------------------------


const DashboardPage: FC = () => {
  // [2] จัดการ State สำหรับ Pagination และ Search
  // --------------------------------------------------
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const ITEMS_PER_PAGE = 10;

  const filteredData = useMemo(() =>
    mockData.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [searchTerm]
  );

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  // --------------------------------------------------

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-cyan-200 to-blue-300 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 space-y-6">

        {/* NEWLY ADDED: Link to go back to the Home page */}
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-cyan-700 hover:underline transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>

        {/* [3] ส่วน Header: Search Bar และปุ่ม Add Food */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-auto">
            <input
              type="search"
              placeholder="Search food by name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>
          <Link href="/addfood" passHref>
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 bg-cyan-500 text-white font-semibold rounded-full shadow-md hover:bg-cyan-600 transition-transform transform hover:-translate-y-1">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add Food
            </button>
          </Link>
        </div>

        {/* [4] ตารางแสดงผลข้อมูล */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs text-gray-800 uppercase bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3">Food</th>
                <th scope="col" className="px-6 py-3">Meal</th>
                <th scope="col" className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{item.date}</td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <Image src={item.imageUrl} alt={item.name} width={40} height={40} className="rounded-2xl w-40 h-20 object-cover" />
                    <span className="font-medium">{item.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      item.meal === 'Breakfast' ? 'bg-yellow-100 text-yellow-800' :
                      item.meal === 'Lunch' ? 'bg-green-100 text-green-800' :
                      item.meal === 'Dinner' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {item.meal}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button className="font-medium text-blue-600 hover:underline">Edit</button>
                    <button className="font-medium text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* [5] ส่วนของ Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-4">
          <span className="text-sm text-gray-700 mb-2 sm:mb-0">
            Showing <span className="font-semibold">{startIndex + 1}</span> to <span className="font-semibold">{Math.min(startIndex + ITEMS_PER_PAGE, filteredData.length)}</span> of <span className="font-semibold">{filteredData.length}</span> Results
          </span>
          <div className="inline-flex -space-x-px text-sm">
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 disabled:opacity-50">
              Previous
            </button>
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 disabled:opacity-50">
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;