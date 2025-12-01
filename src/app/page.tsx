// src/app/page.tsx
import Link from "next/link"
import prisma from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default async function Home() {
  // Ambil Statistik Real-time
  const [totalAlumni, totalRegions] = await Promise.all([
    prisma.user.count(),
    prisma.region.count()
  ])

  // Ambil daftar wilayah untuk ditampilkan
  const regions = await prisma.region.findMany({
    select: { name: true, slug: true }
  })

  return (
    <main className="min-h-screen bg-slate-50">
      
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Satu Hati, Satu Almamater.
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            Wadah silaturahmi digital untuk alumni Pesantren Al-Ikhlas di seluruh dunia.
            Temukan kawan lama, bangun jejaring, dan saling menguatkan.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link href="/register">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-bold">
                Gabung Sekarang
              </Button>
            </Link>
            <Link href="/search">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-slate-800 hover:text-white">
                Cari Alumni
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 -mt-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card Statistik 1 */}
          <Card className="shadow-lg border-none">
            <CardContent className="p-6 text-center">
              <p className="text-4xl font-bold text-blue-600">{totalAlumni}</p>
              <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mt-1">Alumni Terdaftar</p>
            </CardContent>
          </Card>
          
          {/* Card Statistik 2 */}
          <Card className="shadow-lg border-none">
            <CardContent className="p-6 text-center">
              <p className="text-4xl font-bold text-green-600">{totalRegions}</p>
              <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mt-1">Wilayah Kepengurusan</p>
            </CardContent>
          </Card>

          {/* Card Statistik 3 (Hardcoded/Dummy dulu untuk tahun berdiri) */}
          <Card className="shadow-lg border-none">
            <CardContent className="p-6 text-center">
              <p className="text-4xl font-bold text-purple-600">∞</p>
              <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mt-1">Ikatan Persaudaraan</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Wilayah Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold text-slate-800">Jaringan Wilayah</h2>
          <p className="text-slate-600">IKA Al-Ikhlas kini hadir di berbagai kota besar.</p>
          
          <div className="flex flex-wrap justify-center gap-3">
            {regions.map((region) => (
              <span key={region.slug} className="px-4 py-2 bg-slate-100 rounded-full text-slate-700 font-medium border hover:bg-slate-200 transition cursor-default">
                📍 {region.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Sederhana */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-4 text-center text-sm">
        <p>© {new Date().getFullYear()} Ikatan Keluarga Alumni Al-Ikhlas. Developed with Pride.</p>
      </footer>
    </main>
  )
}