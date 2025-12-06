// src/app/galeri/[slug]/page.tsx
import prisma from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AlbumDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params
  
  const album = await prisma.galleryAlbum.findUnique({
    where: { slug },
    include: { images: true }
  })

  if (!album) return <div>Album tidak ditemukan</div>

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-end border-b border-slate-700 pb-6">
          <div>
            <Link href="/galeri" className="text-slate-400 text-sm hover:text-white mb-2 block">← Kembali ke Galeri</Link>
            <h1 className="text-3xl font-bold">{album.title}</h1>
            <p className="text-slate-400 mt-1">
              {new Date(album.eventDate).toLocaleDateString('id-ID', { dateStyle: 'full' })} • {album.images.length} Foto
            </p>
          </div>
        </div>

        {/* Grid Foto */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {album.images.map((img) => (
            <div key={img.id} className="relative group aspect-square bg-slate-800 rounded-lg overflow-hidden">
              <img 
                src={img.imageUrl} 
                className="w-full h-full object-cover transition duration-500 group-hover:scale-110" 
                loading="lazy"
              />
              {/* Overlay agar user bisa klik kanan save */}
              <a 
                href={img.imageUrl} 
                target="_blank" 
                className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center opacity-0 group-hover:opacity-100"
              >
                <span className="bg-white/90 text-black px-3 py-1 rounded-full text-xs font-bold">
                  Lihat Full
                </span>
              </a>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}