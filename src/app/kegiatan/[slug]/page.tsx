// src/app/kegiatan/[slug]/page.tsx
import prisma from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type Props = {
  params: { slug: string }
}

export default async function ActivityDetailPage({ params }: Props) {
  // Fix Next.js 15 params async
  const { slug } = await params // Await params jika pakai Next 15, kalau Next 14 bisa langsung params.slug

  const activity = await prisma.activity.findUnique({
    where: { slug: slug },
    include: { 
      region: true,
      author: {
        include: { profile: true }
      }
    }
  })

  if (!activity) {
    return <div className="p-10 text-center">Berita tidak ditemukan.</div>
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Image */}
      <div className="w-full h-[400px] bg-slate-200 relative">
        {activity.imageUrl && (
          <img src={activity.imageUrl} alt={activity.title} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/40 flex items-end p-8 md:p-16">
          <div className="max-w-4xl mx-auto w-full text-white">
            <span className="bg-blue-600 px-3 py-1 rounded text-sm font-bold mb-4 inline-block">
              {activity.region.name}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mb-2">{activity.title}</h1>
            <p className="text-slate-200">
              Diposting oleh {activity.author.profile?.fullName} • {new Date(activity.createdAt).toLocaleDateString('id-ID')}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto py-12 px-6">
        <Link href="/kegiatan">
          <Button variant="ghost" className="mb-6 pl-0 hover:pl-2 transition-all">← Kembali ke Daftar</Button>
        </Link>
        
        <article className="prose prose-lg max-w-none text-slate-800 whitespace-pre-line leading-relaxed">
          {activity.content}
        </article>
      </div>
    </div>
  )
}