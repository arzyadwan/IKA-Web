// src/app/search/page.tsx
import { getSession } from "@/lib/session"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Prisma } from "@prisma/client"

export default async function SearchPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams
  const session = await getSession()
  if (!session) redirect('/login') // Search hanya untuk member login (Privasi)

  // Ambil query dari URL (contoh: /search?q=budi)
  // Perbaikan untuk Next.js 15: searchParams mungkin perlu diawait atau dianggap promise di versi bleeding edge, 
  // tapi di stable version 14/15 biasa, ini objek langsung.
  // Jika error type, kita cast safely.
  const query = (typeof searchParams.q === 'string') ? searchParams.q : ''

  type SearchResult = Prisma.ProfileGetPayload<{
    include: { region: true }
  }>

  // Inisialisasi variabel dengan tipe yang jelas
  let results: SearchResult[] = []

  if (query.length > 2) {
    results = await prisma.profile.findMany({
      where: {
        OR: [
          { fullName: { contains: query, mode: 'insensitive' } },
          { profession: { contains: query, mode: 'insensitive' } },
        ]
      },
      include: {
        region: true
      },
      take: 20
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Cari Alumni</h1>
          <Link href="/dashboard"><Button variant="outline">Dashboard</Button></Link>
        </div>

        {/* Form Pencarian Sederhana (Get Method) */}
        <form action="/search" method="GET" className="flex gap-2">
          <Input 
            name="q" 
            placeholder="Ketik nama atau pekerjaan... (Min. 3 huruf)" 
            defaultValue={query} 
            className="bg-white"
          />
          <Button type="submit">Cari</Button>
        </form>

        {/* Hasil Pencarian */}
        <div className="space-y-4">
          {query.length > 0 && query.length < 3 && (
            <p className="text-red-500 text-sm">Ketik minimal 3 huruf.</p>
          )}

          {results.length > 0 ? (
            results.map((profile) => (
              <Card key={profile.id} className="hover:shadow-md transition">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{profile.fullName}</h3>
                    <p className="text-sm text-slate-600">
                      Angkatan {profile.graduationYear} • {profile.profession || 'Belum isi profesi'}
                    </p>
                    <div className="mt-2 flex gap-2">
                       <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                         {profile.region.name}
                       </span>
                       {profile.bloodType && (
                         <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                           Gol. {profile.bloodType}
                         </span>
                       )}
                    </div>
                  </div>
                  
                  {/* Tombol WA (Hanya muncul jika ada nomor) */}
                  {profile.phoneNumber && (
                    <a 
                      href={`https://wa.me/${profile.phoneNumber.replace(/^0/, '62')}`} 
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="secondary" size="sm">Chat WA</Button>
                    </a>
                  )}
                </CardContent>
              </Card>
            ))
          ) : query.length > 2 ? (
            <div className="text-center py-10 text-slate-500">
              Tidak ditemukan alumni dengan kata kunci &quot;{query}&quot;.
            </div>
          ) : null}
        </div>

      </div>
    </div>
  )
}