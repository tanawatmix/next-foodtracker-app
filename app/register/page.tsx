'use client';

import { useState, ChangeEvent, FC, useRef } from 'react'; // Import useRef
import Image from 'next/image';
import Link from 'next/link';
import user from '../images/user.png';

/**
 * RegisterPage Component
 * * หน้าลงทะเบียนสำหรับผู้ใช้ใหม่
 */
const RegisterPage: FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  // NEW: สร้าง ref เพื่อเข้าถึง file input element โดยตรง
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * จัดการการเปลี่ยนแปลงเมื่อผู้ใช้เลือกไฟล์รูปภาพ
   */
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

  /**
   * NEW: ฟังก์ชันสำหรับลบรูปภาพตัวอย่าง
   */
  const handleRemoveImage = () => {
    setImagePreview(null);
    // Reset ค่าใน input file เพื่อให้สามารถเลือกไฟล์เดิมได้อีกครั้ง
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-300 via-pink-400 to-red-500 p-4">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-2xl shadow-xl">
        
        <div className="mb-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-700 hover:underline transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>

        <div className="text-center">
          <Image
            src={user}
            alt="User Icon"
            width={80}
            height={80}
            className="mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-800">Create an Account</h1>
          <p className="text-gray-500">Join us and start tracking your meals!</p>
        </div>

        <form className="space-y-6">
          {/* Input: Full Name */}
          <div>
            <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="fullname"
              name="fullname"
              type="text"
              required
              // MODIFIED: ลบ focus:... class ออก
              className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-md outline-none"
              placeholder="John Doe"
            />
          </div>

          {/* Input: Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              // MODIFIED: ลบ focus:... class ออก
              className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-md outline-none"
              placeholder="you@example.com"
            />
          </div>

          {/* Input: Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              // MODIFIED: ลบ focus:... class ออก
              className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-md outline-none"
              placeholder="••••••••"
            />
          </div>

          {/* Input: Gender */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              // MODIFIED: ลบ focus:... class ออก
              className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-md outline-none"
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          {/* Input: Profile Picture with Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Profile Picture
            </label>
            <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  // MODIFIED: เพิ่มปุ่มลบรูปเข้ามา
                  <div className="relative w-24 h-24 mx-auto">
                    <Image
                      src={imagePreview}
                      alt="Profile preview"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-0 right-0 flex items-center justify-center w-6 h-6 bg-red-500 border-2 border-white rounded-full text-white hover:bg-red-600 transition-colors"
                      aria-label="Remove image"
                    >
                      &times;
                    </button>
                  </div>
                ) : (
                  // ไอคอนเริ่มต้น (เหมือนเดิม)
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                <div className="flex text-sm text-gray-600 justify-center">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                  >
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} ref={fileInputRef} />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Register
            </button>
          </div>
        </form>

        <hr className="my-6 border-gray-300" />

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;