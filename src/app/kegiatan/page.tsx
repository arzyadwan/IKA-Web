// src/app/kegiatan/page.tsx
import prisma from "@/lib/prisma"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/session"

export default async function KegiatanListPage() {
  const session = await getSession()
  const isAdmin = session?.role === 'region_admin' || session?.role === 'super_admin'

  const activities = await prisma.activity.findMany({
    orderBy: { createdAt: 'desc' },
    include: { region: true }
  })

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Kabar Al-Ikhlas</h1>
            <p className="text-slate-500">Update kegiatan terkini dari seluruh wilayah.</p>
          </div>
          
          {/* Tombol Buat Berita (Hanya muncul untuk Admin) */}
          {isAdmin && (
            <Link href="/admin/activities/create">
              <Button>+ Tulis Berita</Button>
            </Link>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((item) => (
            <Link key={item.id} href={`/kegiatan/${item.slug}`}>
              <Card className="h-full hover:shadow-lg transition overflow-hidden">
                {/* Gambar Thumbnail */}
                <div className="h-48 bg-slate-200 w-full relative">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">No Image</div>
                  )}
                  <span className="absolute top-2 right-2 bg-white/90 px-2 py-1 text-xs font-bold rounded text-slate-900">
                    {item.region.name}
                  </span>
                </div>
                
                <CardContent className="p-5">
                  <h2 className="font-bold text-xl mb-2 line-clamp-2">{item.title}</h2>
                  <p className="text-slate-600 text-sm line-clamp-3 mb-4">
                    {item.excerpt}
                  </p>
                  <span className="text-xs text-slate-400">
                    {new Date(item.createdAt).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {activities.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            Belum ada kegiatan yang diposting.
          </div>
        )}

      </div>
    </div>
  )
}