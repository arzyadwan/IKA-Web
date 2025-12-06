import Link from "next/link"
import { RegisterForm } from "./register-form"
import prisma from "@/lib/prisma"
import { ArrowLeft } from "lucide-react"

export default async function RegisterPage() {
  // Ambil data wilayah untuk dropdown
  const regions = await prisma.region.findMany({
    select: { id: true, name: true, slug: true }
  })

  return (
    <div className="w-full min-h-screen grid lg:grid-cols-2">
      
      {/* SISI KANAN (Form) - Di Mobile dia di atas, di Desktop dia di Kanan (Swap order) */}
      <div className="flex flex-col justify-center items-center p-8 bg-white relative order-2 lg:order-1">
        <Link href="/" className="absolute top-8 left-8 text-sm font-medium text-slate-500 hover:text-primary flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Beranda
        </Link>

        <div className="w-full max-w-md space-y-6 mt-10 lg:mt-0">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Bergabung Bersama Kami</h1>
            <p className="text-slate-500">
              Isi data diri Anda untuk menjadi bagian dari keluarga besar.
            </p>
          </div>

          {/* Panggil Form Logic */}
          <RegisterForm regions={regions} />

          <p className="text-center text-sm text-slate-500">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>

      {/* SISI KIRI (Branding) - Di Desktop dia di Kanan */}
      <div className="hidden lg:flex flex-col justify-between bg-slate-900 p-10 text-white relative overflow-hidden order-1 lg:order-2">
        {/* Background Accent (Emas) Circle */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="relative z-10 flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 bg-accent rounded flex items-center justify-center text-white">A</div>
          IKA Al-Ikhlas
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <blockquote className="border-l-4 border-accent pl-6 italic text-xl text-slate-300">
            &quot;Organisasi ini bukan hanya tempat berkumpul, tapi rumah untuk kembali dan tumbuh bersama.&quot;
          </blockquote>
          <div className="flex gap-4">
            <div className="flex flex-col">
              <span className="font-bold text-3xl">1000+</span>
              <span className="text-sm text-slate-400">Alumni</span>
            </div>
            <div className="h-12 w-px bg-slate-700"></div>
            <div className="flex flex-col">
              <span className="font-bold text-3xl">5+</span>
              <span className="text-sm text-slate-400">Wilayah</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-slate-500">
          Bergabunglah sekarang. Gratis.
        </div>
      </div>

    </div>
  )
}