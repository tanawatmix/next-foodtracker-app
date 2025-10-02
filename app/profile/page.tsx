"use client";

import { useState, useRef, FC, FormEvent, ChangeEvent, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/SupabaseClient";

// Type สำหรับข้อมูลผู้ใช้
interface User {
  id: string; // uuid
  fullname: string;
  email: string;
  gender: string;
  user_image_url: string;
}

const ProfilePage: FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  // State สำหรับจัดการฟอร์ม
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("Male");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. ดึงข้อมูลผู้ใช้เมื่อเปิดหน้า
  useEffect(() => {
    const userDataString = localStorage.getItem("food_tracker_user");
    if (userDataString) {
      const loggedInUser: User = JSON.parse(userDataString);
      setUser(loggedInUser);

      // 2. ตั้งค่าเริ่มต้นให้กับฟอร์ม
      setFullName(loggedInUser.fullname);
      setEmail(loggedInUser.email);
      setGender(loggedInUser.gender);
      setImagePreview(loggedInUser.user_image_url);
    } else {
      router.push("/login");
    }
    setIsLoading(false);
  }, [router]);

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

  // 3. ฟังก์ชันยกเลิก: รีเซ็ตฟอร์มกลับไปเป็นข้อมูลเดิม
  const handleCancel = () => {
    if (user) {
      setFullName(user.fullname);
      setEmail(user.email);
      setPassword("");
      setGender(user.gender);
      setImagePreview(user.user_image_url);
      setImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // 4. ฟังก์ชันบันทึกการแก้ไขลง Supabase
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true);

    let newImageUrl = user.user_image_url;

    try {
      // 4.1 ถ้ามีการเลือกรูปใหม่
      if (imageFile) {
        // 🔹 ลบรูปเก่าออกจาก storage ก่อน (ถ้ามี)
        if (user.user_image_url) {
          const fileImageName = user.user_image_url.split("/user_bk").pop();
          if (fileImageName) {
            await supabase.storage
              .from("user_bk")
              .remove([`public/${fileImageName}`]);
          }
        }

        // 🔹 อัปโหลดไฟล์ใหม่
        const filePath = `public/${user.id}/${Date.now()}_${imageFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("user_bk")
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("user_bk")
          .getPublicUrl(filePath);

        newImageUrl = urlData.publicUrl;
      }

      // 4.2 เตรียมข้อมูลที่จะอัปเดต
      const updates = {
        fullname: fullName,
        email: email,
        gender: gender,
        user_image_url: newImageUrl,
        ...(password && { password: password }),
      };

      // 4.3 อัปเดตข้อมูลในตาราง user_tb
      const { data: updatedUser, error: updateError } = await supabase
        .from("user_tb")
        .update(updates)
        .eq("id", user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      // 4.4 อัปเดต localStorage
      localStorage.setItem("food_tracker_user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      alert("Profile updated successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-300 p-8">
      <div className="max-w-2xl mx-auto bg-white/80 rounded-2xl shadow-lg p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center">Edit Your Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            {imagePreview && (
              <Image
                src={imagePreview}
                alt="Profile Preview"
                width={128}
                height={128}
                className="rounded-full object-cover"
              />
            )}
            <label
              htmlFor="file-upload"
              className="cursor-pointer px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Change Picture
              <input
                id="file-upload"
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
              />
            </label>
          </div>
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium">
              Full Name
            </label>
            <input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              type="text"
              required
              className="w-full p-2 mt-1 bg-gray-100 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="w-full p-2 mt-1 bg-gray-100 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              New Password
            </label>
            <input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full p-2 mt-1 bg-gray-100 rounded-md"
              placeholder="Leave blank to keep current"
            />
          </div>
          <div>
            <label htmlFor="gender" className="block text-sm font-medium">
              Gender
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full p-2 mt-1 bg-gray-100 rounded-md"
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div className="flex justify-end gap-4">
            <Link
              href="/dashboard"
              className="px-6 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Back to Dashboard
            </Link>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default ProfilePage;
