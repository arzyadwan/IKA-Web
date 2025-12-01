// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar"; // <--- Import ini

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IKA Al-Ikhlas",
  description: "Portal Resmi Ikatan Keluarga Alumni Al-Ikhlas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <Navbar />  {/* <--- Pasang di sini */}
        {children}
      </body>
    </html>
  );
}