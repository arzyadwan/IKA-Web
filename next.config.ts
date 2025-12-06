import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Abaikan error Eslint saat build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 2. Abaikan error TypeScript saat build
  typescript: {
    ignoreBuildErrors: true,
  },
  // 3. Pastikan gambar dari luar bisa dimuat (Opsional, tapi penting utk fitur berita)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Izinkan semua domain gambar sementara
      },
    ],
  },
};

export default nextConfig;