// src/components/navbar.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/session"; // Kita cek session di sini

export async function Navbar() {
  const session = await getSession();

  return (
    <nav className="border-b bg-white">
      <div className="flex h-16 items-center px-4 max-w-7xl mx-auto justify-between">
        {/* Logo / Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl text-slate-900">
            IKA Al-Ikhlas
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-black">
              Beranda
            </Link>
            <Link href="/berita" className="hover:text-black">
              Berita
            </Link>{" "}
            {/* <-- Baru */}
            <Link href="/agenda" className="hover:text-black">
              Agenda
            </Link>{" "}
            {/* <-- Baru (dulunya /kegiatan) */}
            <Link href="/search" className="hover:text-black">
              Cari Alumni
            </Link>
          </div>
        </div>

        {/* Tombol Kanan */}
        <div className="flex items-center gap-4">
          {session ? (
            // Jika Sudah Login
            <Link href="/dashboard">
              <Button>Dashboard Saya</Button>
            </Link>
          ) : (
            // Jika Belum Login
            <div className="flex gap-2">
              <Link href="/login">
                <Button variant="ghost">Masuk</Button>
              </Link>
              <Link href="/register">
                <Button variant="default">Daftar Anggota</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
