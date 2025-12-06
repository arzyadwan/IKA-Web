import prisma from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, MapPin, Download } from "lucide-react"

export default async function AlbumDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  const album = await prisma.galleryAlbum.findUnique({
    where: { slug },
    include: { images: true, region: true }
  })

  if (!album) return <div className="text-center p-20 text-white">Album tidak ditemukan</div>

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pb-20">
      
      {/* Header Info */}
      <div className="bg-[#1e293b] border-b border-slate-700/50 pt-10 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/galeri" className="inline-flex items-center text-slate-400 hover:text-white mb-6 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Galeri
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{album.title}</h1>
              <div className="flex flex-wrap gap-4 text-slate-400 text-sm">
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" /> {album.region.name}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" /> 
                  {new Date(album.eventDate).toLocaleDateString('id-ID', { dateStyle: 'full' })}
                </span>
                <span className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-xs">
                  {album.images.length} Foto
                </span>
              </div>
              {album.description && (
                <p className="mt-4 text-slate-300 max-w-2xl leading-relaxed">{album.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Photo Grid */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {album.images.map((img) => (
            <div key={img.id} className="relative group break-inside-avoid rounded-xl overflow-hidden bg-slate-800">
              <img 
                src={img.imageUrl} 
                className="w-full h-auto object-cover transition duration-500 group-hover:brightness-75 group-hover:scale-105" 
                loading="lazy"
                alt="Dokumentasi"
              />
              
              {/* Overlay Actions */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <a 
                  href={img.imageUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-full hover:bg-white/30 hover:scale-110 transition-all text-white"
                  title="Lihat Full / Download"
                >
                  <Download className="w-5 h-5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}