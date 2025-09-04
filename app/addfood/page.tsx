'use client';

import { useState, useRef, FC, FormEvent, ChangeEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { StaticImageData } from 'next/image';
import userAvatar from '../images/user.png'; // ภาพโปรไฟล์ผู้ใช้

// Mock data สำหรับผู้ใช้ที่ล็อกอินอยู่ (เหมือนหน้า Dashboard)
const loggedInUser = {
  name: 'Tanawat Mix',
  profileImageUrl: userAvatar,
};

const AddFoodPage: FC = () => {
  // State สำหรับจัดการฟอร์ม
  const [foodName, setFoodName] = useState('');
  const [mealType, setMealType] = useState('Breakfast');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // ค่าเริ่มต้นเป็นวันปัจจุบัน
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Ref สำหรับเข้าถึง file input เพื่อ reset ค่า
  const fileInputRef = useRef<HTMLInputElement>(null);

  // จัดการเมื่อมีการเลือกรูปภาพ
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // จัดการเมื่อกดยกเลิก (Reset ฟอร์ม)
  const handleCancel = () => {
    setFoodName('');
    setMealType('Breakfast');
    setDate(new Date().toISOString().split('T')[0]);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // จัดการเมื่อกดบันทึก
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Logic สำหรับบันทึกข้อมูล (ส่งไป API)
    const formData = { foodName, mealType, date, image: imagePreview };
    console.log('Saving data:', formData);
    alert('Food saved successfully!');
    // สามารถ redirect ไปหน้า dashboard หลังบันทึกสำเร็จ
    // router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 via-rose-200 to-purple-300 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 space-y-6">

        {/* ส่วน Header: ลิงก์ย้อนกลับและข้อมูลผู้ใช้ */}
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-rose-700 hover:underline transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
          <Link href="/profile" className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-full transition-colors">
            <Image
              src={loggedInUser.profileImageUrl}
              alt="User Profile"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <span className="hidden sm:inline font-semibold text-gray-700">{loggedInUser.name}</span>
          </Link>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Add New Food</h1>
          <p className="text-gray-500">Log the details of your meal below.</p>
        </div>

        {/* ฟอร์มเพิ่มข้อมูลอาหาร */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Food Name */}
          <div>
            <label htmlFor="foodName" className="block text-sm font-medium text-gray-700">Food Name</label>
            <input
              id="foodName"
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-md outline-none"
              placeholder="e.g., Grilled Chicken Salad"
            />
          </div>

          {/* Meal Type */}
          <div>
            <label htmlFor="mealType" className="block text-sm font-medium text-gray-700">Meal Type</label>
            <select
              id="mealType"
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-md outline-none"
            >
              <option>Breakfast</option>
              <option>Lunch</option>
              <option>Dinner</option>
              <option>Snack</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-md outline-none"
            />
          </div>

          {/* Food Picture with Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Food Picture</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <div className="relative w-48 h-32 mx-auto">
                    <Image src={imagePreview} alt="Food preview" layout="fill" objectFit="cover" className="rounded-md" />
                  </div>
                ) : (
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                <div className="flex text-sm text-gray-600 justify-center">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-rose-600 hover:text-rose-500">
                    <span>Upload a file</span>
                    <input id="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} ref={fileInputRef} />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 shadow-md"
            >
              Save Food
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFoodPage;