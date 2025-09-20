"use client";

import { useState, useEffect, useMemo, FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/SupabaseClient";
import userAvatar from "../../public/images/user.png";

// MODIFIED: แก้ไข Type ของ id ให้เป็น string
interface User {
  id: string;
  fullname: string;
  user_image_url: string;
}

interface FoodEntry {
  id: string;
  fooddate_at: string;
  foodname: string;
  food_image_url: string;
  meal: string;
}

const DashboardPage: FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [foodData, setFoodData] = useState<FoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchSessionAndData = async () => {
      const userDataString = localStorage.getItem("food_tracker_user");
      if (!userDataString) {
        router.push("/login");
        return;
      }
      const loggedInUser: User = JSON.parse(userDataString);
      setUser(loggedInUser);

      try {
        const { data, error } = await supabase
          .from("food_tb")
          .select("*")
          .eq("user_id", loggedInUser.id)
          .order("fooddate_at", { ascending: false });

        if (error) throw error;
        setFoodData(data || []);
      } catch (error) {
        console.error("Error fetching food data:", error);
        alert("Could not fetch food data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionAndData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("food_tracker_user");
    router.push("/login");
  };

  const handleDelete = async (itemId: string, imageUrl: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      const { error: deleteError } = await supabase
        .from("food_tb")
        .delete()
        .eq("id", itemId);
      if (deleteError) throw deleteError;

      const imagePath = imageUrl.split("/food_bk/")[1];
      if (imagePath) {
        await supabase.storage.from("food_bk").remove([imagePath]);
      }

      // MODIFIED: แก้ไขการเปรียบเทียบให้เป็น string (ลบ Number() ออก)
      setFoodData((currentData) =>
        currentData.filter((item) => item.id !== itemId)
      );
      alert("Item deleted successfully!");
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item.");
    }
  };

  const filteredData = useMemo(
    () =>
      foodData.filter((item) =>
        item.foodname.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [foodData, searchTerm]
  );

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-200 via-cyan-200 to-blue-300 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 space-y-6">
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-auto">
            <input
              type="search"
              placeholder="Search food by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-80 pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/addfood" className="px-5 py-2 bg-cyan-500 text-white font-semibold rounded-full shadow-md hover:bg-cyan-600">Add Food</Link>
            <Link href="/profile" className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100">
              <Image src={user.user_image_url || userAvatar} alt="Profile" width={40} height={40} className="rounded-full object-cover"/>
              <span className="font-semibold hidden sm:inline">{user.fullname}</span>
            </Link>
            <button onClick={handleLogout} title="Logout" className="p-2 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </div>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Food</th>
                <th className="px-6 py-3 text-left">Meal</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{new Date(item.fooddate_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <Image src={item.food_image_url} alt={item.foodname} width={40} height={40} className="rounded-full object-cover"/>
                      <span className="font-medium">{item.foodname}</span>
                    </td>
                    <td className="px-6 py-4">{item.meal}</td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <Link href={`/updatefood/${item.id}`} className="font-medium text-blue-600 hover:underline">Edit</Link>
                      <button 
                        onClick={() => handleDelete(item.id, item.food_image_url)} 
                        className="font-medium text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">No food entries found. Add your first meal!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <nav className="flex items-center justify-between pt-4">
          <span className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredData.length)} of {filteredData.length} Results
          </span>
          <div>
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="px-3 h-8 border rounded-l-lg disabled:opacity-50 hover:bg-gray-100">Prev</button>
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 h-8 border rounded-r-lg disabled:opacity-50 hover:bg-gray-100">Next</button>
          </div>
        </nav>
      </div>
    </main>
  );
};

export default DashboardPage;

