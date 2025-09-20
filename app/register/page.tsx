'use client';

import { useState, ChangeEvent, FC, useRef, FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/SupabaseClient';

const RegisterPage: FC = () => {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.currentTarget;
    const fullname = form.fullname.value;
    const email = form.email.value;
    const password = form.password.value;
    const gender = form.gender.value;

    if (!imageFile) {
      alert('Please select a profile picture.');
      setIsLoading(false);
      return;
    }

    try {
      const filePath = `public/${Date.now()}_${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('user_bk')
        .upload(filePath, imageFile);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('user_bk')
        .getPublicUrl(filePath);
      
      const imageUrl = urlData.publicUrl;

      const { error: insertError } = await supabase.from('user_tb').insert({
        fullname, email, password, gender, user_image_url: imageUrl,
      });
      if (insertError) throw insertError;

      alert('Registration successful! Please log in.');
      router.push('/login');
    } catch (error) { // MODIFIED: Removed ': any'
      console.error('Registration Error:', error);
      let message = 'An error occurred during registration.';
      if (error instanceof Error) {
        message = error.message;
      }
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-300 via-pink-400 to-red-500 p-4">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-2xl shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create an Account</h1>
        </div>
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label htmlFor="fullname">Full Name</label>
            <input id="fullname" name="fullname" type="text" required className="w-full px-4 py-2 mt-1 rounded-md bg-gray-100"/>
          </div>
          <div>
            <label htmlFor="email">Email Address</label>
            <input id="email" name="email" type="email" required className="w-full px-4 py-2 mt-1 rounded-md bg-gray-100"/>
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required className="w-full px-4 py-2 mt-1 rounded-md bg-gray-100"/>
          </div>
          <div>
            <label htmlFor="gender">Gender</label>
            <select id="gender" name="gender" className="w-full px-4 py-2 mt-1 rounded-md bg-gray-100">
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label>Profile Picture</label>
            <div className="mt-1 flex justify-center p-6 border-2 border-dashed rounded-md">
              <div className="text-center">
                {imagePreview && (
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <Image src={imagePreview} alt="Preview" layout="fill" objectFit="cover" className="rounded-full"/>
                    <button type="button" onClick={handleRemoveImage} className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6">&times;</button>
                  </div>
                )}
                <label htmlFor="file-upload" className="cursor-pointer font-medium text-indigo-600">
                  <span>Upload a file</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} ref={fileInputRef} required/>
                </label>
              </div>
            </div>
          </div>
          <button type="submit" disabled={isLoading} className="w-full py-3 font-medium text-white bg-indigo-600 rounded-md disabled:bg-gray-400">
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="text-center text-sm">
          Already have an account? <Link href="/login" className="font-medium text-indigo-600">Login here</Link>
        </p>
      </div>
    </main>
  );
};

export default RegisterPage;