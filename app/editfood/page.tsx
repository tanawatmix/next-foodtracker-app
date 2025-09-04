'use client';

import { useState, useRef, FC, FormEvent, ChangeEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { StaticImageData } from 'next/image';
import foodImage from '../images/foodbanner.jpg'; // ภาพอาหารตั้งต้น

// Mock Data: ข้อมูลของอาหารที่จะนำมาแก้ไข
const currentFoodData = {
  id: 1,
  name: 'Chicken Salad',
  meal: 'Lunch',
  date: '2025-09-04',
  imageUrl: foodImage,
};

const EditFoodPage: FC = () => {
  // State สำหรับจัดการฟอร์ม โดยมีค่าเริ่มต้นจาก currentFoodData
  const [foodName, setFoodName] = useState(currentFoodData.name);
  const [mealType, setMealType] = useState(currentFoodData.meal);
  const [date, setDate] = useState(currentFoodData.date);
  const [imagePreview, setImagePreview] = useState<string | StaticImageData>(currentFoodData.imageUrl);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // จัดการเมื่อมีการเลือกรูปภาพใหม่
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

  // จัดการเมื่อกดยกเลิกการแก้ไข
  const handleCancel = () => {
    // รีเซ็ต State ทั้งหมดกลับไปเป็นค่าเริ่มต้น
    setFoodName(currentFoodData.name);
    setMealType(currentFoodData.meal);
    setDate(currentFoodData.date);
    setImagePreview(currentFoodData.imageUrl);
    // เคลียร์ค่าใน file input ที่อาจถูกเลือกไว้
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // จัดการเมื่อกดบันทึกการเปลี่ยนแปลง
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedFoodData = { id: currentFoodData.id, foodName, mealType, date, image: imagePreview };
    console.log('Updating food data:', updatedFoodData);
    alert('Food updated successfully!');
    // สามารถ redirect ไปหน้า dashboard หลังบันทึกสำเร็จ
    // router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-200 via-lime-200 to-yellow-300 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 space-y-6">

        {/* ส่วน Header: ลิงก์กลับหน้าหลัก */}
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-teal-700 hover:underline transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Edit Food Entry</h1>
          <p className="text-gray-500">Update the details of your meal below.</p>
        </div>

        {/* ฟอร์มแก้ไขข้อมูลอาหาร */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Food Picture with Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Food Picture</label>
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-48 h-32">
                <Image 
                  src={imagePreview} 
                  alt="Food preview" 
                  layout="fill" 
                  objectFit="cover" 
                  className="rounded-md" 
                />
              </div>
              <label htmlFor="file-upload" className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700">
                Change Picture
                <input id="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} ref={fileInputRef} />
              </label>
            </div>
          </div>
          
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

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <Link href="/dashboard" passHref>
              <button
                type="button"
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-transparent border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Back to Dashboard
              </button>
            </Link>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 shadow-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFoodPage;