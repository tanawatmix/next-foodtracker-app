'use client';

import { useState, useRef, FC, FormEvent, ChangeEvent, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/SupabaseClient';

// Type สำหรับข้อมูลผู้ใช้ที่ดึงจาก localStorage
interface User {
  id: number;
  fullname: string;
  user_image_url: string;
}

const AddFoodPage: FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  // State สำหรับจัดการฟอร์ม
  const [foodName, setFoodName] = useState('');
  const [mealType, setMealType] = useState('Breakfast');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ตรวจสอบผู้ใช้ที่ล็อกอินเมื่อเปิดหน้า
  useEffect(() => {
    const userDataString = localStorage.getItem('food_tracker_user');
    if (userDataString) {
      setUser(JSON.parse(userDataString));
    } else {
      router.push('/login'); // ถ้ายังไม่ล็อกอิน ให้กลับไปหน้า Login
    }
  }, [router]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    setFoodName('');
    setMealType('Breakfast');
    setDate(new Date().toISOString().split('T')[0]);
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ฟังก์ชันหลักสำหรับบันทึกข้อมูลลง Supabase
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!imageFile || !user) {
      alert('Please select an image and ensure you are logged in.');
      return;
    }
    setIsLoading(true);

    try {
      // 1. อัปโหลดรูปภาพไปที่ Storage 'food_bk'
      const filePath = `public/${user.id}/${Date.now()}_${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('food_bk')
        .upload(filePath, imageFile);
      if (uploadError) throw uploadError;

      // 2. ดึง Public URL ของรูปที่เพิ่งอัปโหลด
      const { data: urlData } = supabase.storage
        .from('food_bk')
        .getPublicUrl(filePath);
      
      const imageUrl = urlData.publicUrl;

      // 3. บันทึกข้อมูลทั้งหมดลงตาราง 'food_tb'
      const { error: insertError } = await supabase.from('food_tb').insert({
        foodname: foodName,
        meal: mealType,
        fooddate_at: date,
        food_image_url: imageUrl,
        user_id: user.id, // ผูกข้อมูลอาหารกับผู้ใช้ที่ล็อกอินอยู่
      });
      if (insertError) throw insertError;

      alert('Food saved successfully!');
      router.push('/dashboard'); // กลับไปหน้า Dashboard

    } catch (error) {
      console.error('Error saving food:', error);
      let message = 'An unexpected error occurred.';
      if (error instanceof Error) message = error.message;
      alert(`Error: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-200 via-rose-200 to-purple-300 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 space-y-6">
        <header className="flex items-center justify-between">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-rose-700 hover:underline">
            Back to Dashboard
          </Link>
          <Link href="/profile" className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-full">
            <Image src={user.user_image_url} alt="Profile" width={40} height={40} className="rounded-full object-cover"/>
            <span className="hidden sm:inline font-semibold">{user.fullname}</span>
          </Link>
        </header>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Add New Food</h1>
          <p className="text-gray-500">Log the details of your meal below.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="foodName" className="block text-sm font-medium text-gray-700">Food Name</label>
            <input id="foodName" type="text" value={foodName} onChange={(e) => setFoodName(e.target.value)} required className="w-full px-4 py-2 mt-1 rounded-md bg-gray-100"/>
          </div>
          <div>
            <label htmlFor="mealType" className="block text-sm font-medium text-gray-700">Meal Type</label>
            <select id="mealType" value={mealType} onChange={(e) => setMealType(e.target.value)} className="w-full px-4 py-2 mt-1 rounded-md bg-gray-100">
              <option>Breakfast</option>
              <option>Lunch</option>
              <option>Dinner</option>
              <option>Snack</option>
            </select>
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
            <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full px-4 py-2 mt-1 rounded-md bg-gray-100"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Food Picture</label>
            <div className="mt-1 flex justify-center p-6 border-2 border-dashed rounded-md">
              <div className="text-center">
                {imagePreview ? (
                  <div className="relative w-48 h-32 mx-auto mb-4">
                    <Image src={imagePreview} alt="Food preview" layout="fill" objectFit="cover" className="rounded-md" />
                  </div>
                ) : (
                  <div className="text-gray-400">
                    {/* SVG Icon Placeholder */}
                  </div>
                )}
                <label htmlFor="file-upload" className="cursor-pointer font-medium text-rose-600 hover:text-rose-500">
                  <span>Upload a file</span>
                  <input id="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} ref={fileInputRef} required/>
                </label>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-4 pt-4">
            <button type="button" onClick={handleCancel} className="px-6 py-2 text-sm font-medium bg-gray-200 rounded-md hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="px-6 py-2 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 shadow-md disabled:bg-gray-400">
              {isLoading ? 'Saving...' : 'Save Food'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default AddFoodPage;

