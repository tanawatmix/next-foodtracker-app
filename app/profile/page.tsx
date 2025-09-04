'use client';

import { useState, useRef, FC, FormEvent, ChangeEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { StaticImageData } from 'next/image';
import userAvatar from '../images/user.png';

// Mock Data: ข้อมูลปัจจุบันของผู้ใช้
const currentUserData = {
  fullName: 'Tanawat Mix',
  email: 'tanawat.m@example.com',
  gender: 'Male',
  profileImageUrl: userAvatar,
};

const ProfilePage: FC = () => {
  // State สำหรับจัดการฟอร์ม
  const [fullName, setFullName] = useState(currentUserData.fullName);
  const [email, setEmail] = useState(currentUserData.email);
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState(currentUserData.gender);
  const [imagePreview, setImagePreview] = useState<string | StaticImageData>(currentUserData.profileImageUrl);

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

  // NEW: ฟังก์ชันสำหรับยกเลิกการแก้ไข
  const handleCancel = () => {
    // รีเซ็ต State ทั้งหมดกลับไปเป็นค่าเริ่มต้น
    setFullName(currentUserData.fullName);
    setEmail(currentUserData.email);
    setPassword('');
    setGender(currentUserData.gender);
    setImagePreview(currentUserData.profileImageUrl);
    // เคลียร์ค่าใน file input ที่อาจถูกเลือกไว้
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

// จัดการเมื่อกดบันทึกการเปลี่ยนแปลง
const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const updatedData = { fullName, email, password: password || 'Not Changed', gender, image: imagePreview };
  console.log('Updating profile with:', updatedData);
  alert('Profile updated successfully!');
};

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-300 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 space-y-6">

        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Edit Your Profile</h1>
          <p className="text-gray-500">Update your personal information below.</p>
        </div>

        {/* ฟอร์มแก้ไขข้อมูล */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Profile Picture with Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-32 h-32">
                <Image 
                  src={imagePreview} 
                  alt="Profile preview" 
                  layout="fill" 
                  objectFit="cover" 
                  className="rounded-full" 
                />
              </div>
              <label htmlFor="file-upload" className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                Change Picture
                <input id="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} ref={fileInputRef} />
              </label>
            </div>
          </div>
          
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-md outline-none"
            />
          </div>

          {/* Email Address */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-md outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password (optional)</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-md outline-none"
              placeholder="Leave blank to keep current password"
            />
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-md outline-none"
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
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

            {/* NEW: ปุ่มยกเลิกการแก้ไข */}
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 shadow-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default ProfilePage;