import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // ใส่ hostname ของ Supabase Storage ของคุณที่มาจาก Error
        hostname: 'lpunjmvrmtsmkqtwktsg.supabase.co',
        port: '',
        pathname: '/**', // อนุญาตทุก path ภายใต้ hostname นี้
      },
      // ถ้าในอนาคตคุณใช้รูปจาก Pixabay อีก ก็สามารถเพิ่มแบบนี้ได้
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
