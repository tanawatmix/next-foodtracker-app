'use client';

import { useState, useEffect, useMemo, FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/SupabaseClient'; // 1. Import Supabase client

// 2. สร้าง Interface ให้ตรงกับตารางใน Supabase
interface User {
  id: number;
  fullname: string;
  user_image_url: string;
}

interface FoodEntry {
  id: number;
  fooddate_at: string;
  foodname: string;
  food_image_url: string;
  meal: string;
}

const DashboardPage: FC = () => {
  const router = useRouter();

  // 3. สร้าง State สำหรับเก็บข้อมูลจริง
  const [user, setUser] = useState<User | null>(null);
  const [foodData, setFoodData] = useState<FoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State เดิมสำหรับ Pagination และ Search
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const ITEMS_PER_PAGE = 10;

  // 4. ใช้ useEffect เพื่อดึงข้อมูลเมื่อเปิดหน้าเว็บ
  useEffect(() => {
    const fetchSessionAndData = async () => {
      // 4.1 ตรวจสอบข้อมูลผู้ใช้จาก localStorage
      const userDataString = localStorage.getItem('food_tracker_user');
      if (!userDataString) {
        router.push('/login');
        return;
      }
      
      const loggedInUser: User = JSON.parse(userDataString);
      setUser(loggedInUser);

      // 4.2 ดึงข้อมูลอาหารจากตาราง food_tb
      try {
        const { data, error } = await supabase
          .from('food_tb')
          .select('*')
          .eq('user_id', loggedInUser.id) // ดึงเฉพาะข้อมูลที่ user_id ตรงกัน
          .order('fooddate_at', { ascending: false }); // เรียงจากวันที่ล่าสุด

        if (error) {
          throw error;
        }

        setFoodData(data || []);
      } catch (error: any) {
        console.error('Error fetching food data:', error);
        alert('Could not fetch food data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionAndData();
  }, [router]);

  // 5. อัปเดตฟังก์ชัน Logout
  const handleLogout = () => {
    localStorage.removeItem('food_tracker_user');
    router.push('/login');
  };

  // --- ส่วน Logic ของ Pagination และ Search (เหมือนเดิม) ---
  const filteredData = useMemo(() =>
    foodData.filter((item) =>
      item.foodname.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [foodData, searchTerm]
  );

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // แสดง Loading spinner จนกว่าจะดึงข้อมูลผู้ใช้เสร็จ
  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading user data...</div>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-200 via-cyan-200 to-blue-300 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 space-y-6">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-cyan-700">
            &larr; Back to Home
          </Link>
        </div>

        {/* 6. อัปเดต Header ให้แสดงข้อมูลจาก State 'user' */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-auto">
            <input type="search" placeholder="Search food by name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-80 pl-10 pr-4 py-2 border rounded-full"
            />
            {/* Search Icon */}
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
            <Link href="/addfood" className="px-5 py-2 bg-cyan-500 text-white font-semibold rounded-full shadow-md">Add Food</Link>
            <Link href="/profile" className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-full">
              <Image src={user.user_image_url} alt="User Profile" width={40} height={40} className="rounded-full object-cover"/>
              <span className="hidden sm:inline font-semibold">{user.fullname}</span>
            </Link>
            <button onClick={handleLogout} className="p-2 text-gray-500 hover:bg-red-100 rounded-full" title="Logout">
                {/* Logout Icon */}
            </button>
          </div>
        </header>

        {/* 7. อัปเดตตารางให้แสดงข้อมูลจาก State 'foodData' */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-800 uppercase bg-gray-100">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Food</th>
                <th className="px-6 py-3">Meal</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={4} className="text-center p-8">Loading your food entries...</td></tr>
              ) : currentItems.length === 0 ? (
                <tr><td colSpan={4} className="text-center p-8 text-gray-500">No food entries found. Add one!</td></tr>
              ) : (
                currentItems.map((item) => (
                  <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{new Date(item.fooddate_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <Image src={item.food_image_url} alt={item.foodname} width={40} height={40} className="rounded-full object-cover"/>
                      <span className="font-medium">{item.foodname}</span>
                    </td>
                    <td className="px-6 py-4">{item.meal}</td>
                    <td className="px-6 py-4 text-center space-x-2">
                       {/* 8. อัปเดตลิงก์ Edit ให้ไปที่ Dynamic Route */}
                       <Link href={`/updatefood/${item.id}`} className="font-medium text-blue-600 hover:underline">Edit</Link>
                       <button className="font-medium text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination (ทำงานได้เหมือนเดิม) */}
        <div className="flex items-center justify-between pt-4">
          <span>Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredData.length)} of {filteredData.length} Results</span>
          <div>
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="px-3 h-8 border rounded-l-lg">Previous</button>
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 h-8 border rounded-r-lg">Next</button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;

