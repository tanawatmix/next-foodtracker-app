'use client';

import { useState, useRef, FC, FormEvent, ChangeEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// REMOVED: No longer importing user avatar
// import userAvatar from '../images/user.png'; 

// Mock Data using a direct path string for the image
const currentUserData = {
  fullName: 'Tanawat Mix',
  email: 'tanawat.m@example.com',
  gender: 'Male',
  profileImageUrl: '/images/user.png', // MODIFIED: Use direct path
};

const ProfilePage: FC = () => {
  const [fullName, setFullName] = useState(currentUserData.fullName);
  const [email, setEmail] = useState(currentUserData.email);
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState(currentUserData.gender);
  const [imagePreview, setImagePreview] = useState<string>(currentUserData.profileImageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleCancel = () => {
    setFullName(currentUserData.fullName);
    setEmail(currentUserData.email);
    setPassword('');
    setGender(currentUserData.gender);
    setImagePreview(currentUserData.profileImageUrl);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture Section uses imagePreview state which is initialized with the correct path */}
        </form>
      </div>
    </main>
  );
};

export default ProfilePage;