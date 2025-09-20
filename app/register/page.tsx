'use client';

import { useState, ChangeEvent, FC, useRef, FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/SupabaseClient';

// REMOVED: No longer importing the user image
// import user from '../images/user.png';

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
    } catch (error: any) {
      console.error('Registration Error:', error);
      alert(error.message || 'An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-300 via-pink-400 to-red-500 p-4">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-2xl shadow-xl">
        <div className="text-center">
          <Image
            src="/images/user.png" // MODIFIED: Use direct path from public
            alt="User Icon"
            width={80}
            height={80}
            className="mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-800">Create an Account</h1>
        </div>
        <form onSubmit={handleRegister} className="space-y-6">
          {/* Form fields... */}
        </form>
      </div>
    </main>
  );
};

export default RegisterPage;