import Link from "next/link"
import { LoginForm } from "./login-form"
import { ArrowLeft } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="w-full h-screen grid lg:grid-cols-2">
      
      {/* SISI KIRI: Branding (Hanya muncul di Layar Besar) */}
      <div className="hidden lg:flex flex-col justify-between bg-primary p-10 text-white relative overflow-hidden">
        {/* Pattern Background Halus */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        <div className="relative z-10 flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">A</div>
          IKA Al-Ikhlas
        </div>

        <div className="relative z-10 space-y-4 max-w-lg">
          <h2 className="text-4xl font-extrabold leading-tight">
            Selamat Datang Kembali, Alumni.
          </h2>
          <p className="text-primary-foreground/80 text-lg">
            &quot;Menjaga silaturahmi adalah kunci pembuka rezeki dan pemanjang umur.&quot;
          </p>
        </div>

        <div className="relative z-10 text-sm text-primary-foreground/60">
          © 2025 Portal Resmi IKA Al-Ikhlas
        </div>
      </div>

      {/* SISI KANAN: Form */}
      <div className="flex flex-col justify-center items-center p-8 bg-white relative">
        <Link href="/" className="absolute top-8 right-8 text-sm font-medium text-primary hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </Link>

        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Masuk Akun</h1>
            <p className="text-slate-500">
              Masukkan email dan password untuk mengakses dashboard.
            </p>
          </div>

          {/* Panggil Form Logic yang sudah ada */}
          <LoginForm />

          <p className="text-center text-sm text-slate-500">
            Belum punya akun?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>

    </div>
  )
}