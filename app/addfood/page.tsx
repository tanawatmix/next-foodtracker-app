'use client';

import { useState, useRef, FC, FormEvent, ChangeEvent, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// --- Type and Mock Database (This would be a fetch in a real app) ---
type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
interface FoodEntry {
  id: number;
  date: string;
  name: string;
  imageUrl: string;
  meal: MealType;
}
const mockFoodDatabase: FoodEntry[] = [
    { id: 1, date: '2025-09-04', name: "Chicken Salad", imageUrl: "https://cdn.pixabay.com/photo/2017/03/17/16/20/eat-2152670_1280.jpg", meal: "Lunch" },
    { id: 2, date: '2025-09-03', name: "Spaghetti Carbonara", imageUrl: "https://cdn.pixabay.com/photo/2023/05/29/18/41/carbonara-8027222_1280.jpg", meal: "Dinner" },
    { id: 3, date: '2025-09-02', name: "Avocado Toast", imageUrl: "https://cdn.pixabay.com/photo/2017/03/30/15/48/avocado-2189053_1280.jpg", meal: "Breakfast" },
    { id: 4, date: '2025-09-01', name: "Salmon Steak", imageUrl: "https://cdn.pixabay.com/photo/2014/11/05/15/57/salmon-518032_1280.jpg", meal: "Dinner" },
    { id: 5, date: '2025-08-31', name: "Fruit Smoothie", imageUrl: "https://cdn.pixabay.com/photo/2018/02/23/11/06/smoothie-3175402_1280.jpg", meal: "Snack" },
];

// -------------------------------------------------------------------------------- //
// Form Component
// -------------------------------------------------------------------------------- //
const EditFoodForm: FC<{ initialData: FoodEntry }> = ({ initialData }) => {
  const [foodName, setFoodName] = useState(initialData.name);
  const [mealType, setMealType] = useState<MealType>(initialData.meal);
  const [date, setDate] = useState(initialData.date);
  const [imagePreview, setImagePreview] = useState<string>(initialData.imageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setImagePreview(reader.result as string); };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    setFoodName(initialData.name);
    setMealType(initialData.meal);
    setDate(initialData.date);
    setImagePreview(initialData.imageUrl);
    if (fileInputRef.current) { fileInputRef.current.value = ''; }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedFoodData = { id: initialData.id, foodName, mealType, date, image: imagePreview };
    console.log('Updating food data:', updatedFoodData);
    alert('Food updated successfully!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
      <div>
        <label htmlFor="foodName" className="block text-sm font-medium text-gray-700">Food Name</label>
        <input
          id="foodName" type="text" value={foodName}
          onChange={(e) => setFoodName(e.target.value)} required
          className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-md outline-none"
        />
      </div>
      <div>
        <label htmlFor="mealType" className="block text-sm font-medium text-gray-700">Meal Type</label>
        <select
          id="mealType" value={mealType}
          onChange={(e) => setMealType(e.target.value as MealType)}
          className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-md outline-none"
        >
          <option>Breakfast</option><option>Lunch</option><option>Dinner</option><option>Snack</option>
        </select>
      </div>
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
        <input
          id="date" type="date" value={date}
          onChange={(e) => setDate(e.target.value)} required
          className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-md outline-none"
        />
      </div>
      <div className="flex items-center justify-end gap-4 pt-4">
        <Link href="/dashboard" passHref>
          <button type="button" className="px-6 py-2 text-sm font-medium text-gray-700 bg-transparent border border-gray-300 rounded-md hover:bg-gray-100">
            Back to Dashboard
          </button>
        </Link>
        <button type="button" onClick={handleCancel} className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
          Cancel
        </button>
        <button type="submit" className="px-6 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 shadow-md">
          Save Changes
        </button>
      </div>
    </form>
  );
};
// -------------------------------------------------------------------------------- //

// Main Page Component
const EditFoodPage: FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = use(params);
  const foodId = parseInt(resolvedParams.id, 10);
  const currentFoodData = mockFoodDatabase.find(food => food.id === foodId);

  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-200 via-lime-200 to-yellow-300 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 space-y-6">
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
          {currentFoodData && <p className="text-gray-500">You are editing: <span className="font-semibold">{currentFoodData.name}</span></p>}
        </div>
        
        {currentFoodData ? (
          <EditFoodForm initialData={currentFoodData} />
        ) : (
          <div className="text-center py-8">
            <h2 className="text-xl font-bold">Food not found</h2>
            <Link href="/dashboard" className="text-blue-600 hover:underline mt-2 inline-block">
              Go back to Dashboard
            </Link>
          </div>
        )}
      </div>
    </main>
  );
};

export default EditFoodPage;
