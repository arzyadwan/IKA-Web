// src/app/dashboard/page.tsx
import { getSession } from "@/lib/session"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { logoutUser } from "@/actions/auth"
import Link from "next/link"
import { 
  User, MapPin, Search, RefreshCw, LogOut, 
  ShieldCheck, AlertTriangle, ChevronRight, CreditCard
} from "lucide-react"

export default async function DashboardPage() {
  const session = await getSession()
  if (!session || !session.userId) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: parseInt(session.userId as string) },
    include: {
      profile: {
        include: { region: true }
      }
    }
  })

  if (!user || !user.profile) return <div>Error loading profile.</div>

  const isVerified = user.verificationStatus === 'verified'

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      
      {/* --- HEADER SECTION --- */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Selamat Datang, {user.profile.fullName.split(' ')[0]}! 👋
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Dashboard Keanggotaan IKA Al-Ikhlas
              </p>
            </div>
            
            <form action={logoutUser}>
              <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-100">
                <LogOut className="w-4 h-4 mr-2" />
                Keluar Aplikasi
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">

        {/* ALERT: JIKA BELUM VERIFIED */}
        {!isVerified && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <div className="p-2 bg-amber-100 rounded-full text-amber-600 mt-1">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-amber-800">Status Akun: Belum Diverifikasi</h3>
              <p className="text-sm text-amber-700 mt-1 leading-relaxed">
                Anda belum dapat mengakses fitur pencarian alumni. Admin wilayah sedang memverifikasi data Anda. 
                Mohon tunggu atau hubungi pengurus wilayah.
              </p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-12 gap-8">
          
          {/* KOLOM KIRI: KTA DIGITAL (4 Kolom) */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-slate-800">Kartu Tanda Anggota</h2>
            </div>

            {/* --- KOMPONEN KTA DIGITAL --- */}
            <div className="relative w-full aspect-[1.586/1] rounded-2xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.02] duration-500">
              {/* Background Gradient Hijau-Emas */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#1a5c13] to-slate-900"></div>
              
              {/* Pattern Texture */}
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
              
              {/* Glass Effect Overlay */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

              {/* Content KTA */}
              <div className="relative h-full p-6 flex flex-col justify-between text-white">
                
                {/* Header KTA */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center font-bold border border-white/10">A</div>
                    <span className="font-bold text-sm tracking-widest uppercase opacity-90">IKA Al-Ikhlas</span>
                  </div>
                  {/* Chip Emas Simulasi */}
                  <div className="w-10 h-7 bg-gradient-to-r from-yellow-200 to-yellow-500 rounded flex items-center justify-center opacity-80">
                    <div className="w-6 h-4 border border-yellow-600/50 rounded-sm"></div>
                  </div>
                </div>

                {/* Body KTA */}
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-white/60 uppercase tracking-wider mb-1">Nama Anggota</p>
                    <p className="font-bold text-lg md:text-xl tracking-wide text-white truncate shadow-black drop-shadow-md">
                      {user.profile.fullName.toUpperCase()}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-white/60 uppercase tracking-wider mb-1">Nomor Induk / Tahun</p>
                      <p className="font-mono text-sm tracking-widest text-white/90">
                        {user.profile.santriId || '---'} • {user.profile.graduationYear}
                      </p>
                    </div>
                    
                    {/* Status Badge di Kartu */}
                    <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                      isVerified 
                        ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-100' 
                        : 'bg-yellow-500/20 border-yellow-400/50 text-yellow-100'
                    }`}>
                      {isVerified ? 'Verified' : 'Pending'}
                    </div>
                  </div>
                </div>

              </div>
            </div>
            {/* --- END KTA --- */}

            <p className="text-xs text-center text-slate-400">
              *Tunjukkan kartu digital ini saat menghadiri acara resmi.
            </p>
          </div>

          {/* KOLOM KANAN: MENU AKSI (7 Kolom) */}
          <div className="md:col-span-7 space-y-6">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <div className="w-2 h-6 bg-accent rounded-full"></div>
              Pusat Kontrol
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              
              {/* Menu 1: Update Profil */}
              <Link href="/dashboard/profile" className="group">
                <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-5 flex items-start gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-blue-700">Edit Profil</h3>
                      <p className="text-xs text-slate-500 mt-1">Update data pekerjaan, alamat, dan kontak darurat.</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Menu 2: Cari Alumni */}
              <Link href="/search" className={`group ${!isVerified ? 'pointer-events-none opacity-60' : ''}`}>
                <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-5 flex items-start gap-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Search className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-emerald-700">Cari Alumni</h3>
                      <p className="text-xs text-slate-500 mt-1">Temukan teman seangkatan atau satu domisili.</p>
                      {!isVerified && <span className="text-[10px] text-red-500 font-bold mt-1 block">🔒 Terkunci</span>}
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Menu 3: Mutasi */}
              <Link href="/dashboard/mutation" className="group">
                <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-5 flex items-start gap-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <RefreshCw className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-purple-700">Mutasi Wilayah</h3>
                      <p className="text-xs text-slate-500 mt-1">Pindah domisili kepengurusan IKA.</p>
                      <div className="mt-2 inline-flex items-center text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
                        <MapPin className="w-3 h-3 mr-1" />
                        Saat ini: {user.profile.region.name}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Menu 4: Agenda (Shortcut) */}
              <Link href="/agenda" className="group">
                <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-5 flex items-start gap-4">
                    <div className="p-3 bg-orange-50 text-orange-600 rounded-lg group-hover:bg-orange-600 group-hover:text-white transition-colors">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-orange-700">Agenda Kegiatan</h3>
                      <p className="text-xs text-slate-500 mt-1">Lihat jadwal acara terdekat dan mendaftar.</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}