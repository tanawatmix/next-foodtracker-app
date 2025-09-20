'use client';

import { useState, useEffect, useMemo, FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/SupabaseClient';

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
  const [user, setUser] = useState<User | null>(null);
  const [foodData, setFoodData] = useState<FoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  useEffect(() => {
    const fetchSessionAndData = async () => {
      const userDataString = localStorage.getItem('food_tracker_user');
      if (!userDataString) {
        router.push('/login');
        return;
      }
      const loggedInUser: User = JSON.parse(userDataString);
      setUser(loggedInUser);

      try {
        const { data, error } = await supabase
          .from('food_tb')
          .select('*')
          .eq('user_id', loggedInUser.id)
          .order('fooddate_at', { ascending: false });

        if (error) throw error;
        setFoodData(data || []);
      } catch (error) { // MODIFIED: Removed ': any'
        console.error('Error fetching food data:', error);
        alert('Could not fetch food data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionAndData();
  }, [router]);

  // Minimal JSX return to fix the error
  return (
    <div>
      {/* TODO: Add your dashboard UI here */}
      <h1>Dashboard</h1>
    </div>
  );
};

export default DashboardPage;