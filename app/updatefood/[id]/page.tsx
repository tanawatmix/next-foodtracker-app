"use client";

// 1. Import 'use' เพิ่มเข้ามา
import {
  useState,
  useRef,
  FC,
  FormEvent,
  ChangeEvent,
  useEffect,
  use,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/SupabaseClient";

interface User {
  id: string;
  fullname: string;
  user_image_url: string;
}
interface FoodEntry {
  id: string;
  fooddate_at: string;
  foodname: string;
  food_image_url: string;
  meal: string;
  user_id?: string;
}
type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";

const EditFoodForm: FC<{ initialData: FoodEntry; user: User }> = ({
  initialData,
  user,
}) => {
  const router = useRouter();
  const [foodName, setFoodName] = useState(initialData.foodname);
  const [mealType, setMealType] = useState<MealType>(
    initialData.meal as MealType
  );
  const [date, setDate] = useState(initialData.fooddate_at);
  const [imagePreview, setImagePreview] = useState<string>(
    initialData.food_image_url
  );
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

  const handleCancel = () => {
    setFoodName(initialData.foodname);
    setMealType(initialData.meal as MealType);
    setDate(initialData.fooddate_at);
    setImagePreview(initialData.food_image_url);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    let newImageUrl = initialData.food_image_url;

    try {
      if (imageFile) {
        // 🔥 ลบรูปเก่าออกจาก storage ถ้ามี
        if (initialData.food_image_url) {
          const fileImageName = initialData.food_image_url
            .split("/public/")
            .pop();
          if (fileImageName) {
            const { error: removeError } = await supabase.storage
              .from("food_bk")
              .remove([`public/${fileImageName}`]);
            if (removeError) {
              console.warn("Failed to delete old image:", removeError.message);
              // ไม่ throw เพราะอยากให้ดำเนินการต่อแม้ลบไฟล์เก่าไม่สำเร็จ
            }
          }
        }

        // อัปโหลดรูปใหม่
        const filePath = `public/${user.id}/${Date.now()}_${imageFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("food_bk")
          .upload(filePath, imageFile);
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("food_bk")
          .getPublicUrl(filePath);
        newImageUrl = urlData.publicUrl;
      }

      // อัปเดตข้อมูลในตาราง
      const { error: updateError } = await supabase
        .from("food_tb")
        .update({
          foodname: foodName,
          meal: mealType,
          fooddate_at: date,
          food_image_url: newImageUrl,
        })
        .eq("id", initialData.id);

      if (updateError) throw updateError;

      alert("Food updated successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating food:", error);
      let message = "An unexpected error occurred.";
      if (error instanceof Error) message = error.message;
      alert(`Error: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Food Picture
        </label>
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
          <label
            htmlFor="file-upload"
            className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700"
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
      </div>
      <div>
        <label
          htmlFor="foodName"
          className="block text-sm font-medium text-gray-700"
        >
          Food Name
        </label>
        <input
          id="foodName"
          type="text"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          required
          className="w-full px-4 py-2 mt-1 bg-gray-100 rounded-md"
        />
      </div>
      <div>
        <label
          htmlFor="mealType"
          className="block text-sm font-medium text-gray-700"
        >
          Meal Type
        </label>
        <select
          id="mealType"
          value={mealType}
          onChange={(e) => setMealType(e.target.value as MealType)}
          className="w-full px-4 py-2 mt-1 bg-gray-100 rounded-md"
        >
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Dinner</option>
          <option>Snack</option>
        </select>
      </div>
      <div>
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-700"
        >
          Date
        </label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full px-4 py-2 mt-1 bg-gray-100 rounded-md"
        />
      </div>
      <div className="flex items-center justify-end gap-4 pt-4">
        <Link href="/dashboard" passHref>
          <button
            type="button"
            className="px-6 py-2 text-sm bg-transparent border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Back to Dashboard
          </button>
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
          className="px-6 py-2 text-sm text-white bg-teal-600 rounded-md hover:bg-teal-700 shadow-md disabled:bg-gray-400"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

const EditFoodPage: FC<{ params: Promise<{ id: string }> }> = ({ params }) => {
  const resolvedParams = use(params);
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [foodData, setFoodData] = useState<FoodEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      const userDataString = localStorage.getItem("food_tracker_user");
      if (!userDataString) {
        router.push("/login");
        return;
      }
      const loggedInUser: User = JSON.parse(userDataString);
      setUser(loggedInUser);

      try {
        const foodId = resolvedParams.id;

        const { data, error: fetchError } = await supabase
          .from("food_tb")
          .select("*")
          .eq("id", foodId)
          .single();

        if (fetchError) throw fetchError;

        if (data.user_id !== loggedInUser.id) {
          throw new Error("You are not authorized to edit this item.");
        }

        setFoodData(data);
      } catch (err) {
        console.error("Error fetching food data:", err);
        if (err instanceof Error) setError(err.message);
        else setError("Could not load food data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [resolvedParams.id, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading editor...
      </div>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-red-600">Error</h2>
          <p className="text-gray-600 mt-2">{error}</p>
          <Link
            href="/dashboard"
            className="text-blue-600 hover:underline mt-4 inline-block"
          >
            Go back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-200 via-lime-200 to-yellow-300 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-teal-700 hover:underline"
          >
            Back to Dashboard
          </Link>
          {user && (
            <Link
              href="/profile"
              className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-full"
            >
              <Image
                src={user.user_image_url}
                alt="User Profile"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <span className="hidden sm:inline font-semibold text-gray-700">
                {user.fullname}
              </span>
            </Link>
          )}
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Edit Food Entry</h1>
          {foodData && (
            <p className="text-gray-500">
              You are editing:{" "}
              <span className="font-semibold">{foodData.foodname}</span>
            </p>
          )}
        </div>

        {foodData && user ? (
          <EditFoodForm initialData={foodData} user={user} />
        ) : (
          !isLoading && <p>Could not load form.</p>
        )}
      </div>
    </main>
  );
};

export default EditFoodPage;
