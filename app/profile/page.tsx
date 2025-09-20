'use client';

import { useState, useRef, FC, FormEvent, ChangeEvent } from 'react';
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';
import userAvatar from '../../public/images/user.png'; // Using public folder

const currentUserData = {
  fullName: 'Tanawat Mix',
  email: 'tanawat.m@example.com',
  gender: 'Male',
  profileImageUrl: userAvatar,
};

const ProfilePage: FC = () => {
  const [fullName, setFullName] = useState(currentUserData.fullName);
  const [email, setEmail] = useState(currentUserData.email);
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState(currentUserData.gender);
  const [imagePreview, setImagePreview] = useState<string | StaticImageData>(currentUserData.profileImageUrl);
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
    alert('Profile updated successfully! (Mock)');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-300 p-8">
      <div className="max-w-2xl mx-auto bg-white/80 rounded-2xl shadow-lg p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center">Edit Your Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
           <div className="flex flex-col items-center gap-4">
              <Image src={imagePreview} alt="Preview" width={128} height={128} className="rounded-full object-cover"/>
              <label htmlFor="file-upload" className="cursor-pointer px-4 py-2 text-sm text-white bg-indigo-600 rounded-md">
                Change Picture
                <input id="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} ref={fileInputRef} />
              </label>
            </div>
            {/* Other form fields like Full Name, Email, Password, Gender */}
            <div className="flex justify-end gap-4">
                <Link href="/dashboard" className="px-6 py-2 text-sm bg-gray-200 rounded-md">Back to Dashboard</Link>
                <button type="button" onClick={handleCancel} className="px-6 py-2 text-sm bg-gray-200 rounded-md">Cancel</button>
                <button type="submit" className="px-6 py-2 text-sm text-white bg-indigo-600 rounded-md">Save Changes</button>
            </div>
        </form>
      </div>
    </main>
  );
};

export default ProfilePage;