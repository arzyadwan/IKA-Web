import prisma from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, User, Share2 } from "lucide-react"

type Props = {
  params: Promise<{ slug: string }>
}

export default async function ArticleDetailPage(props: Props) {
  const params = await props.params
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
    include: { 
      region: true,
      author: { include: { profile: true } }
    }
  })

  if (!article) return <div className="p-20 text-center">Artikel tidak ditemukan.</div>

  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* --- HEADER IMAGE (Full Width with Overlay) --- */}
      <div className="relative w-full h-[50vh] md:h-[60vh] bg-slate-900">
        {article.imageUrl ? (
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-slate-900">
            <span className="text-4xl font-bold text-white/20">IKA Al-Ikhlas</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        
        {/* Title Content */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="max-w-3xl mx-auto">
            <Link href="/berita" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors text-sm font-medium">
              <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Kabar
            </Link>
            
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg border border-white/20">
                {article.region.name}
              </span>
              <span className="bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium border border-white/20 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(article.createdAt).toLocaleDateString('id-ID', { dateStyle: 'long' })}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-6 drop-shadow-sm">
              {article.title}
            </h1>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white font-bold">
                {article.author.profile?.fullName.charAt(0)}
              </div>
              <div className="text-white/90">
                <p className="text-sm font-bold">{article.author.profile?.fullName}</p>
                <p className="text-xs opacity-70">Kontributor / Admin</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTENT BODY --- */}
      <article className="max-w-3xl mx-auto px-6 py-12">
        <div className="prose prose-lg prose-slate max-w-none first-letter:text-5xl first-letter:font-bold first-letter:text-slate-900 first-letter:mr-1 first-letter:float-left">
          {/* Render text dengan line break yang rapi */}
          {article.content.split('\n').map((paragraph, idx) => (
            <p key={idx} className="mb-6 leading-relaxed text-slate-700">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Share / Footer Artikel */}
        <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center">
          <p className="text-slate-400 text-sm italic">
            Artikel ini diterbitkan oleh Pengurus {article.region.name}.
          </p>
          <Button variant="outline" size="sm" className="gap-2 text-slate-600">
            <Share2 className="w-4 h-4" /> Bagikan
          </Button>
        </div>
      </article>

    </div>
  )
}