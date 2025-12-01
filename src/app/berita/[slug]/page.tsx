// src/app/berita/[slug]/page.tsx
import prisma from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function ArticleDetailPage({ params }: { params: { slug: string } }) {
  // Await params untuk kompatibilitas Next.js 15
  const { slug } = await params

  const article = await prisma.article.findUnique({
    where: { slug },
    include: { 
      region: true,
      author: { include: { profile: true } }
    }
  })

  if (!article) return <div className="p-10 text-center">Artikel tidak ditemukan.</div>

  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* Header Artikel */}
      <div className="max-w-3xl mx-auto pt-10 px-6">
        <Link href="/berita">
          <Button variant="ghost" className="mb-6 pl-0 hover:pl-2 text-slate-500">← Kembali ke Daftar</Button>
        </Link>
        
        <div className="flex gap-2 mb-4">
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
            {article.region.name}
          </span>
          <span className="text-slate-500 text-sm py-1">
            {new Date(article.createdAt).toLocaleDateString('id-ID', { dateStyle: 'full' })}
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
          {article.title}
        </h1>

        <div className="flex items-center gap-3 border-b pb-8 mb-8">
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
            {article.author.profile?.fullName.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-sm">{article.author.profile?.fullName}</p>
            <p className="text-xs text-slate-500">Penulis Kontributor</p>
          </div>
        </div>
      </div>

      {/* Gambar Utama */}
      {article.imageUrl && (
        <div className="max-w-5xl mx-auto px-6 mb-10">
          <img src={article.imageUrl} alt={article.title} className="w-full rounded-xl shadow-lg" />
        </div>
      )}

      {/* Isi Konten */}
      <div className="max-w-3xl mx-auto px-6">
        <article className="prose prose-lg prose-slate max-w-none">
          {/* Render text dengan line break sederhana */}
          {article.content.split('\n').map((paragraph, idx) => (
            <p key={idx} className="mb-4 leading-relaxed text-slate-800">
              {paragraph}
            </p>
          ))}
        </article>
      </div>

    </div>
  )
}