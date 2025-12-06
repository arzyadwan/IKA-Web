// src/app/page.tsx
import Link from "next/link"
import prisma from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, MapPin, Calendar, ArrowRight } from "lucide-react"

export default async function Home() {
  const [totalAlumni, totalRegions, totalEvents] = await Promise.all([
    prisma.user.count(),
    prisma.region.count(),
    prisma.event.count()
  ])

  const regions = await prisma.region.findMany({ select: { name: true, slug: true } })

  return (
    <main className="min-h-screen bg-white selection:bg-primary/20">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-white [background-image:radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center px-4 space-y-8 relative z-10">
          
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary transition-colors hover:bg-primary/10 cursor-default mb-4">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse mr-2"></span>
            Portal Alumni Al-Ikhlas
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            Cerdas, <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-primary via-[#4ade80] to-accent bg-clip-text text-transparent">
              Cerah Mencerahkan.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Wadah silaturahmi digital untuk alumni Pesantren Al-Ikhlas di seluruh dunia.
            Temukan kawan lama, bangun jejaring, dan berkontribusi kembali.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link href="/register">
              <Button size="lg" className="h-12 px-8 rounded-full text-lg bg-primary hover:bg-primary/90 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                Gabung Sekarang
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/search">
              <Button size="lg" variant="outline" className="h-12 px-8 rounded-full text-lg border-slate-200 hover:bg-slate-50 text-slate-600">
                Cari Alumni
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-12 px-4 max-w-6xl mx-auto -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            icon={<Users className="w-8 h-8 text-primary" />}
            value={totalAlumni}
            label="Alumni Terdaftar"
            desc="Tersebar di seluruh dunia"
          />
          <StatCard 
            icon={<MapPin className="w-8 h-8 text-accent" />}
            value={totalRegions}
            label="Wilayah Aktif"
            desc="Dari Jakarta hingga Mesir"
          />
          <StatCard 
            icon={<Calendar className="w-8 h-8 text-secondary" />}
            value={totalEvents}
            label="Agenda Kegiatan"
            desc="Kolaborasi tanpa henti"
          />
        </div>
      </section>

      {/* --- FEATURES / REGION SECTION --- */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Jaringan Wilayah</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Kami hadir di berbagai kota besar untuk memastikan tali silaturahmi tidak pernah putus.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {regions.map((region) => (
              <div key={region.slug} className="group relative bg-white px-6 py-3 rounded-full shadow-sm border border-slate-200 hover:border-primary/50 hover:shadow-md transition-all cursor-default">
                <span className="flex items-center gap-2 text-slate-700 font-medium group-hover:text-primary transition-colors">
                  <MapPin className="w-4 h-4 text-slate-400 group-hover:text-primary" />
                  {region.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-100 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="font-bold text-lg text-slate-900">IKA Al-Ikhlas</p>
            <p className="text-sm text-slate-500">Menghubungkan Hati, Mengabdi untuk Negeri.</p>
          </div>
          <p className="text-sm text-slate-400">© {new Date().getFullYear()} Hak Cipta Dilindungi.</p>
        </div>
      </footer>
    </main>
  )
}

// --- PERBAIKAN DI SINI ---
// Kita mendefinisikan tipe props agar tidak pakai 'any'
type StatCardProps = {
  icon: React.ReactNode;
  value: number;
  label: string;
  desc: string;
}

function StatCard({ icon, value, label, desc }: StatCardProps) {
  return (
    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
      <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
        <div className="p-4 bg-slate-50 rounded-full mb-2">
          {icon}
        </div>
        <div>
          <p className="text-4xl font-extrabold text-slate-900 tracking-tight">{value}</p>
          <p className="text-sm font-bold text-slate-700 uppercase tracking-wide mt-1">{label}</p>
          <p className="text-xs text-slate-500 mt-2">{desc}</p>
        </div>
      </CardContent>
    </Card>
  )
}