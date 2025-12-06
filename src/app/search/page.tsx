import { getSession } from "@/lib/session"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Prisma } from "@prisma/client"
import Link from "next/link"
import { Search, MapPin, Briefcase, GraduationCap, Phone, ShieldAlert, ArrowLeft } from "lucide-react"

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function SearchPage(props: Props) {
  const searchParams = await props.searchParams
  const session = await getSession()
  if (!session) redirect('/login')

  // 1. Cek Verifikasi User (Gatekeeping)
  const currentUser = await prisma.user.findUnique({
    where: { id: parseInt(session.userId as string) },
    select: { verificationStatus: true }
  })

  // Tampilan Terkunci (Jika belum verified)
  if (currentUser?.verificationStatus !== 'verified') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-100">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Akses Terbatas</h1>
          <p className="text-slate-600 mb-6 leading-relaxed">
            Akun Anda sedang dalam antrean verifikasi Admin. Demi privasi komunitas, fitur pencarian hanya terbuka untuk anggota terverifikasi.
          </p>
          <Link href="/dashboard">
            <Button variant="outline" className="w-full">Kembali ke Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  // 2. Logika Pencarian
  const query = (typeof searchParams.q === 'string') ? searchParams.q : ''

  type SearchResult = Prisma.ProfileGetPayload<{
    include: { region: true }
  }>

  let results: SearchResult[] = []

  if (query.length > 2) {
    results = await prisma.profile.findMany({
      where: {
        OR: [
          { fullName: { contains: query, mode: 'insensitive' } },
          { profession: { contains: query, mode: 'insensitive' } },
        ]
      },
      include: { region: true },
      take: 20
    })
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      
      {/* --- HEADER & SEARCH BAR --- */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="mb-6">
            <Link href="/dashboard" className="text-sm font-medium text-slate-500 hover:text-primary flex items-center gap-2 mb-2 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-slate-900">Cari Alumni</h1>
            <p className="text-slate-500">Temukan teman seangkatan, senior, atau rekan satu profesi.</p>
          </div>

          <form action="/search" method="GET" className="relative max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input 
                name="q" 
                placeholder="Ketik nama, pekerjaan, atau keahlian..." 
                defaultValue={query} 
                className="pl-12 h-14 text-lg rounded-full border-slate-200 shadow-sm focus:border-primary focus:ring-primary/20 transition-all"
                autoFocus
              />
              <Button type="submit" className="absolute right-2 top-2 bottom-2 rounded-full px-6">
                Cari
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* --- RESULT CONTENT --- */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        
        {/* State: Belum mencari */}
        {query.length === 0 && (
          <div className="text-center py-20 opacity-60">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-lg font-medium text-slate-600">Mulai ketik nama teman Anda di atas</p>
          </div>
        )}

        {/* State: Pencarian terlalu pendek */}
        {query.length > 0 && query.length < 3 && (
          <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg border border-yellow-200 text-center">
            🔍 Mohon ketik minimal 3 huruf agar pencarian lebih akurat.
          </div>
        )}

        {/* State: Tidak ketemu */}
        {query.length > 2 && results.length === 0 && (
          <div className="text-center py-20">
            <p className="text-lg text-slate-600">
              Tidak ditemukan alumni dengan kata kunci <span className="font-bold text-slate-900">&quot;{query}&quot;</span>.
            </p>
            <p className="text-sm text-slate-400 mt-2">Coba gunakan nama panggilan atau kata kunci lain.</p>
          </div>
        )}

        {/* State: Hasil Ditemukan (Grid Layout) */}
        {results.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            {results.map((profile) => (
              <Card key={profile.id} className="overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 group">
                <CardContent className="p-0">
                  <div className="flex">
                    
                    {/* Sisi Kiri: Visual Indicator */}
                    <div className="w-2 bg-gradient-to-b from-primary to-emerald-600"></div>
                    
                    <div className="p-5 w-full">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          {/* Avatar Inisial */}
                          <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-lg font-bold text-primary border border-slate-200 shadow-sm">
                            {profile.fullName.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-slate-900 leading-tight group-hover:text-primary transition-colors">
                              {profile.fullName}
                            </h3>
                            <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                              <GraduationCap className="w-3 h-3" />
                              <span>Angkatan {profile.graduationYear}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Badge Wilayah */}
                        <span className="bg-slate-50 text-slate-600 text-xs font-bold px-2 py-1 rounded border border-slate-200">
                          {profile.region.name}
                        </span>
                      </div>

                      {/* Info Profesi & Lokasi */}
                      <div className="space-y-2 mb-5">
                        <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded">
                          <Briefcase className="w-4 h-4 text-accent" />
                          <span className="font-medium">
                            {profile.profession || 'Profesi belum diisi'}
                          </span>
                        </div>
                        {profile.address && (
                          <div className="flex items-start gap-2 text-xs text-slate-500 px-2">
                            <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                            <span className="line-clamp-1">{profile.address}</span>
                          </div>
                        )}
                      </div>

                      {/* Tombol Aksi */}
                      <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                        {profile.bloodType ? (
                          <span className="text-xs font-bold bg-red-50 text-red-600 px-2 py-1 rounded-full border border-red-100">
                            Gol. {profile.bloodType}
                          </span>
                        ) : (
                          <span></span>
                        )}

                        {profile.phoneNumber ? (
                          <a 
                            href={`https://wa.me/${profile.phoneNumber.replace(/^0/, '62').replace(/\D/g, '')}`} 
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white rounded-full h-8 px-4 text-xs shadow-sm hover:shadow-md transition-all">
                              <Phone className="w-3 h-3 mr-2" />
                              Hubungi
                            </Button>
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400 italic">No WA Hidden</span>
                        )}
                      </div>

                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}