import prisma from "@/lib/prisma"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/session"
import { Plus, Image as ImageIcon, MapPin } from "lucide-react"

export default async function GalleryPage() {
  const session = await getSession()
  const isAdmin = ['region_admin', 'super_admin'].includes(session?.role || '')

  const albums = await prisma.galleryAlbum.findMany({
    orderBy: { eventDate: 'desc' },
    include: { 
      region: true,
      images: { take: 1 } 
    }
  })

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Galeri Dokumentasi</h1>
              <p className="text-slate-500 mt-1">Rekam jejak kenangan dan kegiatan alumni.</p>
            </div>
            {isAdmin && (
              <Link href="/admin/gallery/create">
                <Button className="rounded-full shadow-lg hover:shadow-xl transition-all bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" /> Upload Album
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Album Grid */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {albums.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="font-bold text-lg text-slate-700">Galeri Masih Kosong</h3>
            <p className="text-slate-500 text-sm">Dokumentasi kegiatan akan muncul di sini.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {albums.map((album) => (
              <Link key={album.id} href={`/galeri/${album.slug}`} className="group block">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                  
                  {/* Image Cover */}
                  {album.images[0] ? (
                    <img 
                      src={album.images[0].imageUrl} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 ease-out" 
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400 bg-slate-100">
                      <ImageIcon className="w-10 h-10 opacity-20" />
                    </div>
                  )}

                  {/* Gradient Overlay (Always Visible at bottom) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 p-5 w-full text-white">
                    <div className="flex items-center gap-2 mb-2 opacity-80 text-xs font-medium uppercase tracking-wider">
                      <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
                        {album.region.name}
                      </span>
                      <span>•</span>
                      <span>{new Date(album.eventDate).getFullYear()}</span>
                    </div>
                    
                    <h3 className="font-bold text-lg leading-tight mb-1 group-hover:text-accent transition-colors">
                      {album.title}
                    </h3>
                    
                    <p className="text-xs text-white/70 line-clamp-1 group-hover:text-white transition-colors">
                      Klik untuk melihat foto
                    </p>
                  </div>

                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}