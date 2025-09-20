'use client';

import { useState, useRef, FC, FormEvent, ChangeEvent, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/SupabaseClient'; // 1. Import Supabase
import userAvatar from '../images/user.png';

// Interface for user data stored in localStorage
interface User {
  id: number;
  fullname: string;
  user_image_url: string;
}

const AddFoodPage: FC = () => {
  const router = useRouter();

  // State for the form
  const [mealType, setMealType] = useState('Breakfast');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null); // State for the actual file

  // State for session and loading
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Refs for form elements
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null); // MOVED: Ref is now declared with other hooks

  // 2. Get user data from localStorage on component mount
  useEffect(() => {
    const userDataString = localStorage.getItem('food_tracker_user');
    if (!userDataString) {
      router.push('/login'); // Redirect if not logged in
      return;
    }
    setUser(JSON.parse(userDataString));
  }, [router]);

  // Handle image selection
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file); // Save the file object
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form cancellation
  const handleCancel = () => {
    // Reset all form fields to their initial state
    formRef.current?.reset(); // Use form ref to reset all fields
    setMealType('Breakfast');
    setDate(new Date().toISOString().split('T')[0]);
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // 3. Handle form submission to Supabase
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!imageFile || !user) {
      alert('Please select an image and ensure you are logged in.');
      return;
    }
    setIsLoading(true);

    const form = e.currentTarget;
    const foodname = form.foodName.value;
    const meal = form.mealType.value;
    const fooddate_at = form.date.value;

    try {
      // 3.1 Upload the image to the 'food_bk' storage bucket
      const filePath = `public/${user.id}/${Date.now()}_${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('food_bk')
        .upload(filePath, imageFile);
      if (uploadError) throw uploadError;

      // 3.2 Get the public URL of the uploaded image
      const { data: urlData } = supabase.storage
        .from('food_bk')
        .getPublicUrl(filePath);

      // 3.3 Insert the food record into the 'food_tb' table
      const { error: insertError } = await supabase.from('food_tb').insert({
        foodname,
        meal,
        fooddate_at,
        food_image_url: urlData.publicUrl,
        user_id: user.id, // Link the food entry to the user
      });
      if (insertError) throw insertError;

      alert('Food added successfully!');
      router.push('/dashboard');

    } catch (error: any) {
      console.error('Add food error:', error);
      alert(error.message || 'Failed to add food.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-200 via-rose-200 to-purple-300 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 space-y-6">

        {/* Header: Back link and user info */}
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-rose-700 hover:underline">
            &larr; Back to Dashboard
          </Link>
          {user && (
            <Link href="/profile" className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-full">
              <Image
                src={user.user_image_url || userAvatar}
                alt="User Profile"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <span className="hidden sm:inline font-semibold">{user.fullname}</span>
            </Link>
          )}
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Add New Food</h1>
          <p className="text-gray-500">Log the details of your meal below.</p>
        </div>

        {/* Add Food Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          {/* Food Name */}
          <div>
            <label htmlFor="foodName" className="block text-sm font-medium text-gray-700">Food Name</label>
            <input
              id="foodName"
              name="foodName"
              type="text"
              required
              className="w-full px-4 py-2 mt-1 bg-gray-100 border-gray-300 rounded-md outline-none"
              placeholder="e.g., Grilled Chicken Salad"
            />
          </div>

          {/* Meal Type */}
          <div>
            <label htmlFor="mealType" className="block text-sm font-medium text-gray-700">Meal Type</label>
            <select
              id="mealType"
              name="mealType"
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="w-full px-4 py-2 mt-1 bg-gray-100 border-gray-300 rounded-md outline-none"
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
              name="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 bg-gray-100 border-gray-300 rounded-md outline-none"
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
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3-3a4 4 0 00-5.656 0L28 28M8 32l9-9a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                <div className="flex text-sm text-gray-600 justify-center">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-rose-600 hover:text-rose-500">
                    <span>Upload a file</span>
                    <input id="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} ref={fileInputRef} required />
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
              disabled={isLoading}
              className="px-6 py-2 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 shadow-md disabled:bg-gray-400"
            >
              {isLoading ? 'Saving...' : 'Save Food'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default AddFoodPage;

